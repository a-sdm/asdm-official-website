# 手动安装指南

本指南详细介绍如何手动安装和配置 ASDM Bootstrapper。

## 手动安装

如果您更喜欢手动控制安装过程，可以按照以下步骤进行操作：

### 前提条件：检查 Node.js 环境

在安装前，请确保已安装 Node.js 和 npm：

```bash
node --version
npm --version
```

**预期结果**：
- Node.js 版本为 16 或更高
- npm 版本信息应正常显示

**如果未安装**：请从 https://nodejs.org/ 安装 Node.js，或使用 `nvm`、`apt`、`brew` 等包管理器安装。

### 从 NPM 安装

使用 npm 全局安装 ASDM Bootstrapper CLI：

```bash
npm install -g @leansoftx/asdm-bootstrapper-cli
```

**预期结果**：CLI 工具已全局安装，`asdm` 命令现在可用。

---

完成安装后，您可以参考[使用指南](usage)了解如何使用 ASDM Bootstrapper。




