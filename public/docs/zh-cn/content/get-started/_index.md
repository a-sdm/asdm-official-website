# 快速入门指南

欢迎使用 ASDM Bootstrapper！本指南将帮助您快速了解并开始使用 ASDM (AI First System Development Methodology) 开发工具。

## 什么是 ASDM Bootstrapper？

ASDM Bootstrapper 是一个命令行界面 (CLI) 工具，专为帮助开发者快速设置 ASDM 项目的开发环境而设计。它能自动下载和配置 ASDM 开发所需的必要工具包（toolset）。

### 主要特性

- **列出可用工具包**：从中央注册表查看所有可用的 ASDM 工具包
- **安装工具包**：将工具包下载并安装到您的工作区（`.asdm/toolsets/` 文件夹）
- **快速环境搭建**：简化 ASDM 开发环境的设置过程
- **本地存储**：工具包安装在项目目录的 `.asdm/toolsets/{toolset-id}` 中
- **GitHub 集成**：直接从 GitHub 仓库获取工具包

## 什么是工具包？

工具包（Package）是ASDM的交付单元，每个工具包都是一个可以独立开发、测试、打包和持续交付的实体。同时，工具包被设计成独立于工作空间（workspace）的模式，不依赖于任何特定的工作空间。

ASDM工具包具有广泛的兼容性，可以在多种环境中运行：

**AI Coding工具**：
- Claude Code CLI/插件
- GitHub Copilot
- OpenAI Codex
- Cursor
- Cline
- Trae
- CodeBuddy
- Tongyi等

**非AI Coding环境**：
- Claude Desktop
- Claude.ai
- GitHub Coding Agent
- Cursor Background Agent等

## 前置条件

运行 ASDM工具包 需要满足以下两项基本条件：

### 1. Agentic 工作引擎

工具包本身无法独立运行，需要借助Agentic引擎来工作。以上所列的AI Coding工具和非Coding工具虽然形态和提供商不同，但都内置了Agentic工作引擎。

### 2. 模型能力

Agentic工作引擎虽然可以在大多数LLM上工作，但是为了达到稳定高质量的执行效果，对LLM本身的能力都有一定的基本要求。ASDM作为Agentic工作引擎上的扩展，因其任务调度的复杂度，对底层LLM提出了更高的要求。

作为一个简单的参考，我们需要任何在 2025年4月 之后发布的SOTA模型作为驱动ASDM工具包的基本模型需求。以下列出一些我们推荐的模型，按推荐优先级排序：

1. Claude Sonnet 4.5, Haiku 4.5
2. Claude Sonnet 3.7, 3.5
3. OpenAI GPT 5 Codex
4. GLM 4.6
5. Kimi K2 
6. DeepSeek 3.1 Terminus (底线模型)

**备注：** 底线模型代表任何低于此模型能力的模型都无法正确运行ASDM工具包。

## 安装

### AI 引导安装（推荐）

通过 AI 代理引导完成整个安装过程，无需手动执行命令。

**操作步骤：**

1. 打开您喜欢的 AI 助手工具（如 GitHub Copilot、Cursor、Claude Code、Codebuddy 或其他兼容的 AI 开发工具）
2. 输入以下提示：

```text
按以下文档中的指令操作完成ASDM的安装配置过程
https://asdm.ai/repo/toolsets-repo/INSTALL.md
```

**预期结果：** AI 代理将自动执行安装过程中的所有步骤，包括：
- 检查系统环境
- 安装必要的依赖
- 配置 ASDM 工具
- 验证安装结果

如果您更喜欢手动控制安装过程，请参考[手动安装指南](get-started/manual_install)。

完成安装后，您可以参考[使用指南](get-started/usage)了解如何使用 ASDM Bootstrapper。