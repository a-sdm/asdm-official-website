# 使用指南

本指南介绍如何使用已安装的 ASDM Bootstrapper 工具。

## 基本使用

### 了解命令结构

运行帮助命令了解可用的命令和选项：

```bash
asdm --help
```

**预期输出**：

```bash
Usage: asdm-bootstrapper [options] [command]

ASDM Bootstrapper CLI Tool (v0.0.6)

Options:
  -V, --version           output the version number
  -h, --help              display help for command

Commands:
  list                    List all available ASDM toolsets
  install <toolset-id>    Download and install a specific ASDM toolset
  uninstall <toolset-id>  Uninstall a specific ASDM toolset
```

### 列出可用工具包

运行 list 命令查看所有可用的 ASDM 工具包：

```bash
asdm list
```

**预期输出**：

```bash
Fetching available ASDM toolsets...
Registry URL: https://asdm.ai/repo/toolsets-repo/registry.json

Available toolsets (Registry version: 1.0.1):

[NOT INSTALLED] basic-asdm-toolset (v1.0.1)
  Basic ASDM Toolset
  A basic toolset containing essential ASDM development tools and templates
  Download URL: basic-asdm-toolset.zip

[NOT INSTALLED] advanced-asdm-toolset (v1.0.1)
  Advanced ASDM Toolset
  An advanced toolset with additional tools for complex ASDM projects
  Download URL: advanced-asdm-toolset.zip
```

输出将包含以下信息：
- 工具包 ID（如 basic-asdm-toolset）
- 工具包名称（如 Basic ASDM Toolset）
- 描述
- 版本（如 v1.0.1）
- 安装状态（如 [NOT INSTALLED]）
- 下载 URL

### 安装选定的工具包

选择一个工具包 ID 后，使用以下命令安装：

```bash
asdm install <toolset-id>
```

将 `<toolset-id>` 替换为您选择的实际工具包 ID。

**示例**：
```bash
asdm install basic-asdm-toolset
```

**预期输出**：

```bash
Installing toolset: basic-asdm-toolset...
Fetching registry...
Downloading Basic ASDM Toolset (v1.0.1)...
  Downloading from: https://asdm.ai/repo/toolsets-repo/toolsets/basic-asdm-toolset.zip
Extracting files...
✓ Successfully installed 'basic-asdm-toolset'
Location: /Users/leixu/source/cli-test/.asdm/toolsets/basic-asdm-toolset
```

安装过程包含以下步骤：
1. 获取注册表信息
2. 从指定URL下载工具包
3. 解压文件
4. 完成安装并显示安装位置

工具包将被安装到当前工作区的 `.asdm/toolsets/<toolset-id>` 目录中。