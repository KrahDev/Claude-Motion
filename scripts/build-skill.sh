#!/bin/sh
# Rebuild remotion-motion-graphics.skill (the Claude Desktop install artifact)
# from the remotion-motion-graphics/ folder. Run after ANY edit to the skill.
set -e
cd "$(dirname "$0")/.."
rm -f remotion-motion-graphics.skill
zip -r remotion-motion-graphics.skill remotion-motion-graphics \
  -x "*.DS_Store"
echo "rebuilt remotion-motion-graphics.skill:"
unzip -l remotion-motion-graphics.skill
