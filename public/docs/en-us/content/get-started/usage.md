# Usage Guide

This guide explains how to use the installed ASDM Bootstrapper tool.

## Basic Usage

### Understand Command Structure

Run the help command to understand available commands and options:

```bash
asdm --help
```

**Expected Output**:

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

### List Available Toolsets

Run the list command to view all available ASDM toolsets:

```bash
asdm list
```

**Expected Output**:

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

The output includes:
- Toolset ID (e.g., basic-asdm-toolset)
- Toolset name (e.g., Basic ASDM Toolset)
- Description
- Version (e.g., v1.0.1)
- Installation status (e.g., [NOT INSTALLED])
- Download URL

### Install Selected Toolset

After selecting a toolset ID, use the following command to install:

```bash
asdm install <toolset-id>
```

Replace `<toolset-id>` with the actual toolset ID you selected.

**Example**:
```bash
asdm install basic-asdm-toolset
```

**Expected Output**:

```bash
Installing toolset: basic-asdm-toolset...
Fetching registry...
Downloading Basic ASDM Toolset (v1.0.1)...
  Downloading from: https://asdm.ai/repo/toolsets-repo/toolsets/basic-asdm-toolset.zip
Extracting files...
✓ Successfully installed 'basic-asdm-toolset'
Location: /Users/leixu/source/cli-test/.asdm/toolsets/basic-asdm-toolset
```

The installation process includes:
1. Fetching registry information
2. Downloading the toolset from the specified URL
3. Extracting files
4. Completing installation and displaying the installation location

The toolset will be installed to the `.asdm/toolsets/<toolset-id>` directory in your current workspace.