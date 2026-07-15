const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const contentPath = path.join(repoRoot, "data", "content.json");
const assetRoot = path.join(repoRoot, "assets");
const mediaPattern = /\.(avif|gif|jpe?g|mov|mp4|png|svg|webm|webp)$/i;
const deliveryAssetPattern = /\.(avif|gif|jpe?g|mp4|png|svg|webm|webp)$/i;
const remotePattern = /^(https?:|data:|mailto:|tel:|#)/i;
const assetFileNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp)$/;
const assetDirectoryNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KB = 1024;
const MB = 1024 * KB;
const assetBudgets = [
  {
    label: "hero video",
    limit: 3 * MB,
    matches: (relativePath) => /^assets\/hero\/.+\.(mp4|webm)$/i.test(relativePath),
  },
  {
    label: "site video",
    limit: 15 * MB,
    matches: (relativePath) => /\.(mp4|webm)$/i.test(relativePath),
  },
  {
    label: "PNG image",
    limit: 3 * MB,
    matches: (relativePath) => /\.png$/i.test(relativePath),
  },
  {
    label: "WebP/AVIF image",
    limit: 800 * KB,
    matches: (relativePath) => /\.(avif|webp)$/i.test(relativePath),
  },
  {
    label: "JPG image",
    limit: 4 * MB,
    matches: (relativePath) => /\.jpe?g$/i.test(relativePath),
  },
  {
    label: "SVG image",
    limit: 200 * KB,
    matches: (relativePath) => /\.svg$/i.test(relativePath),
  },
  {
    label: "GIF image",
    limit: 2 * MB,
    matches: (relativePath) => /\.gif$/i.test(relativePath),
  },
];

const issues = [];

const addIssue = (location, message) => {
  issues.push(`${location}: ${message}`);
};

const isLocalMediaPath = (value) => typeof value === "string" && mediaPattern.test(value) && !remotePattern.test(value);

const formatBytes = (bytes) => {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  if (bytes >= KB) return `${Math.ceil(bytes / KB)} KB`;
  return `${bytes} B`;
};

const getAssetBudget = (relativePath) => assetBudgets.find((budget) => budget.matches(relativePath));

const walkFiles = (directory) => {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(entryPath);
    }

    return entry.isFile() ? [entryPath] : [];
  });
};

const checkAssetFile = (filePath) => {
  const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".md") return;

  const assetSegments = relativePath.split("/");
  const directorySegments = assetSegments.slice(1, -1);
  const fileName = assetSegments[assetSegments.length - 1];

  directorySegments.forEach((segment) => {
    if (!assetDirectoryNamePattern.test(segment)) {
      addIssue(relativePath, `Asset folder "${segment}" must use lowercase kebab-case`);
    }
  });

  if (!deliveryAssetPattern.test(fileName)) {
    addIssue(relativePath, "Unsupported delivery asset type. Use AVIF, GIF, JPG, MP4, PNG, SVG, WebM, or WebP");
    return;
  }

  if (!assetFileNamePattern.test(fileName)) {
    addIssue(relativePath, "Asset filename must use lowercase kebab-case with a lowercase extension");
  }

  const budget = getAssetBudget(relativePath);
  const size = fs.statSync(filePath).size;

  if (budget && size > budget.limit) {
    addIssue(relativePath, `${budget.label} is ${formatBytes(size)}, above the ${formatBytes(budget.limit)} hard cap`);
  }
};

const checkExactPath = (relativePath) => {
  const cleanPath = relativePath.replace(/\\/g, "/").replace(/^\.\//, "");
  const parts = cleanPath.split("/").filter(Boolean);
  let current = repoRoot;

  for (const part of parts) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) {
      return { ok: false, reason: "missing" };
    }

    const entries = fs.readdirSync(current);
    const exact = entries.find((entry) => entry === part);
    if (!exact) {
      const caseMatch = entries.find((entry) => entry.toLowerCase() === part.toLowerCase());
      return {
        ok: false,
        reason: caseMatch ? "case" : "missing",
        actual: caseMatch,
        expected: part,
      };
    }

    current = path.join(current, exact);
  }

  if (!fs.existsSync(current) || !fs.statSync(current).isFile()) {
    return { ok: false, reason: "missing" };
  }

  return { ok: true };
};

const checkMediaReference = (value, alt, location) => {
  if (!isLocalMediaPath(value)) return;

  if (!alt || !String(alt).trim()) {
    addIssue(location, `Missing alt text for ${value}`);
  }

  const pathCheck = checkExactPath(value);
  if (pathCheck.ok) return;

  if (pathCheck.reason === "case") {
    addIssue(location, `Path casing mismatch in ${value}; expected segment "${pathCheck.actual}" instead of "${pathCheck.expected}"`);
    return;
  }

  addIssue(location, `Missing media file: ${value}`);
};

const walk = (value, location = "content") => {
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${location}[${index}]`));
    return;
  }

  checkMediaReference(value.src, value.alt, `${location}.src`);
  checkMediaReference(value.cover, value.alt, `${location}.cover`);
  checkMediaReference(value.logo, value.logoAlt, `${location}.logo`);
  checkMediaReference(value.poster, value.posterAlt, `${location}.poster`);

  Object.entries(value).forEach(([key, child]) => {
    if (key !== "src" && key !== "cover" && key !== "logo" && key !== "poster") {
      walk(child, `${location}.${key}`);
    }
  });
};

let content;

walkFiles(assetRoot).forEach(checkAssetFile);

try {
  content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
} catch (error) {
  console.error(`data/content.json: JSON parse failed: ${error.message}`);
  process.exit(1);
}

walk(content);

if (issues.length) {
  console.error(`Pre-publish check found ${issues.length} issue${issues.length === 1 ? "" : "s"}:`);
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

console.log("Pre-publish check passed.");
