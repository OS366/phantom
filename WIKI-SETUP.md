# Wiki Setup Instructions

The wiki files have been created in the `wiki/` directory, but GitHub wikis use a separate repository. Follow these steps to set up the wiki:

## Step 1: Enable Wiki on GitHub

1. Go to your repository: https://github.com/OS366/phantom
2. Click on **Settings** tab
3. Scroll down to **Features** section
4. Check the **Wikis** checkbox to enable it
5. Click **Save**

## Step 2: Push Wiki Files

Once the wiki is enabled, run these commands:

```bash
# Clone the wiki repository (it will be created automatically when you enable wiki)
git clone https://github.com/OS366/phantom.wiki.git phantom-wiki

# Copy the wiki files
cp -r wiki/* phantom-wiki/

# Navigate to wiki directory
cd phantom-wiki

# Add and commit all files
git add .
git commit -m "Add comprehensive wiki documentation"

# Push to GitHub
git push origin master
```

## Alternative: Manual Upload

If you prefer, you can also:

1. Go to your repository on GitHub
2. Click on the **Wiki** tab
3. Click **New Page** for each file
4. Copy the content from the `wiki/` directory files
5. Save each page

## Wiki Pages Included

- **Home** - Main landing page
- **Getting Started** - Installation and basics
- **Map Operations** - Map operations guide
- **String Operations** - String utilities documentation
- **Number Operations** - Number utilities documentation
- **Examples** - Real-world examples
- **Best Practices** - Best practices guide
- **Troubleshooting** - Troubleshooting guide
- **API Reference** - Complete API reference

All files are ready in the `wiki/` directory!

