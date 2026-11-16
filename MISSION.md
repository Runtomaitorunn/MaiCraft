# Mission: 自己维护作品集中的视频

## Why

用户希望以后能自己在作品集里添加、替换视频。本次从接入 YouTube 开始，理解媒体内容怎么填写，以及链接如何变成页面内的播放器。

## Success looks like

- 能在 `data/content.json` 的媒体对象中填写 `src`、`alt` 和可选的 `caption`。
- 能为 `visualBreakMedia` 或 Story Section 的 `media` 添加 YouTube 视频并通过本地预览检查。
- 能分清 YouTube 网页链接、播放器嵌入地址和本地视频文件的作用。

## Constraints

- 沿用现有静态 HTML、CSS、JavaScript 和 JSON 内容结构。
- 使用中文短课，以本仓库的实际代码和添加视频的操作为例。
