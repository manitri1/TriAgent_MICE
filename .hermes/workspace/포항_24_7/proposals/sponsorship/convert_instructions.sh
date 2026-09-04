#!/bin/bash
# Run on your local machine with pandoc installed
# Converts Markdown sponsor documents to DOCX and PDF

set -e
OUTDIR="./converted"
mkdir -p "$OUTDIR"

pandoc sponsor_onepager_20260807.md -o "$OUTDIR/sponsor_onepager_20260807.docx"
pandoc sponsor_onepager_20260807.md -o "$OUTDIR/sponsor_onepager_20260807.pdf"

pandoc sponsor_proposal_20260807.md -o "$OUTDIR/sponsor_proposal_20260807.docx"
pandoc sponsor_proposal_20260807.md -o "$OUTDIR/sponsor_proposal_20260807.pdf"

# Notes:
# 1) Install pandoc: https://pandoc.org/installing.html
# 2) For better PDF rendering, install LaTeX (TinyTeX or TeX Live)
#    e.g., install TinyTeX in R or use tlmgr for TeX Live.
# 3) Run this script from the sponsorship folder where the .md files are located.
