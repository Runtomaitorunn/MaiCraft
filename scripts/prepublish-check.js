const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const contentPath = path.join(repoRoot, "data", "content.json");
const mediaPattern = /\.(avif|gif|jpe?g|mov|mp4|png|svg|webm|webp)$/i;
const remotePattern = /^(https?:|data:|mailto:|tel:|#)/i;

const issues = [];

const addIssue = (location, message) => {
  issues.push(`${location}: ${message}`);
};

const isLocalMediaPath = (value) => typeof value === "string" && mediaPattern.test(value) && !remotePattern.test(value);

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

  Object.entries(value).forEach(([key, child]) => {
    if (key !== "src" && key !== "cover" && key !== "logo") {
      walk(child, `${location}.${key}`);
    }
  });
};

let content;

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
