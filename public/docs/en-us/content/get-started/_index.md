# Quick Start Guide

Welcome to ASDM Bootstrapper! This guide will help you quickly understand and get started with ASDM (AI First System Development Methodology) development tools.

## What is ASDM Bootstrapper?

ASDM Bootstrapper is a Command Line Interface (CLI) tool designed to help developers quickly set up ASDM project development environments. It automatically downloads and configures the necessary toolkits (toolsets) required for ASDM development.

### Key Features

- **List Available Toolsets**: View all available ASDM toolsets from the central registry
- **Install Toolsets**: Download and install toolsets to your workspace (`.asdm/toolsets/` folder)
- **Quick Environment Setup**: Simplify the ASDM development environment setup process
- **Local Storage**: Toolsets are installed in the project directory `.asdm/toolsets/{toolset-id}`
- **GitHub Integration**: Directly fetch toolsets from GitHub repositories

## What is a Toolset?

A toolset is the delivery unit of ASDM. Each toolset is an entity that can be independently developed, tested, packaged, and continuously delivered. Toolsets are designed to be workspace-independent, not relying on any specific workspace.

ASDM toolsets have broad compatibility and can run in various environments:

**AI Coding Tools**:
- Claude Code CLI/Plugin
- GitHub Copilot
- OpenAI Codex
- Cursor
- Cline
- Trae
- CodeBuddy
- Tongyi, etc.

**Non-AI Coding Environments**:
- Claude Desktop
- Claude.ai
- GitHub Coding Agent
- Cursor Background Agent, etc.

## Prerequisites

Running ASDM toolsets requires two basic conditions:

### 1. Agentic Work Engine

Toolsets cannot run independently and require an Agentic engine to function. The AI coding tools and non-coding tools listed above, despite their different forms and providers, all have built-in Agentic work engines.

### 2. Model Capabilities

While Agentic work engines can work with most LLMs, stable and high-quality execution results require certain basic capabilities of the LLM itself. As an extension of the Agentic work engine, ASDM has higher requirements for the underlying LLM due to its complex task scheduling.

As a simple reference, we need any SOTA model released after April 2025 as the basic model requirement to drive ASDM toolsets. Here are some recommended models, listed in order of recommendation priority:

1. Claude Sonnet 4.5, Haiku 4.5
2. Claude Sonnet 3.7, 3.5
3. OpenAI GPT 5 Codex
4. GLM 4.6
5. Kimi K2 
6. DeepSeek 3.1 Terminus (Baseline model)

**Note:** The baseline model represents that any model below this capability cannot correctly run ASDM toolsets.

## Installation

### AI-Guided Installation (Recommended)

Complete the entire installation process through AI agent guidance without manual command execution.

**Steps:**

1. Open your preferred AI assistant tool (such as GitHub Copilot, Cursor, Claude Code, Codebuddy, or other compatible AI development tools)
2. Enter the following prompt:

```text
Follow the instructions in the document below to complete the ASDM installation and configuration process
https://asdm.ai/repo/toolsets-repo/INSTALL.md
```

**Expected Result:** The AI agent will automatically execute all steps in the installation process, including:
- Checking system environment
- Installing necessary dependencies
- Configuring ASDM tools
- Verifying installation results

If you prefer more manual control over the installation process, please refer to the [Manual Installation Guide](get-started/manual_install).

After installation is complete, you can refer to the [Usage Guide](get-started/usage) to learn how to use ASDM Bootstrapper.