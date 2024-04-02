#!/usr/bin/env sh

# This line is very important, otherwise the hook doesn't prevent the commit or merge
#   in case of a failure.
set -e

set -x

simulated_git_branch="$1"

git_branch="$(git rev-parse --abbrev-ref HEAD)"

# Assumption for all `if [ "$branch" = "main" ]` blocks:
#   - we develop on branches other than `main`
#   - we release new versions on `main`

if [ "$simulated_git_branch" = "" ]
then
  if [ "$git_branch" = "main" ]
  then
    run_full_check="yes"
  else
    run_full_check="no"
  fi
else
  if [ "$simulated_git_branch" = "main" ]
  then
    run_full_check="yes"
  else
    run_full_check="no"
  fi
fi

if [ "$run_full_check" = "yes" ]; then
  # If version got bumped in package.json, update the version in package-lock.json as well
  npm install
fi

# Make sure everything is formatted as desired
npm run format

if [ "$run_full_check" = "yes" ]; then
  # Make sure TypeScript types and Jest tests didn't break due to most recent changes.
  # We do this on a `main` branch only in order to allow broken tests while development
  #   is in progress.
  npm test

  # Check examples
  for exampleProject in ./examples/*/
  do
    echo "Checking example project: ${exampleProject} ..."
    cd $exampleProject
    npm install
    npm run format
    npm run tsc
    cd ../../
  done
fi

# Generate up-to-date JS and .d.ts files out of the TypeScript source.
#   Thanks to this command being run on every commit, users can refer to
#   any commit of this repo in their `package.json` files and have BeetPx
#   ready to use there.
# We do this on all branches, because during engine development we might
#   want to install a specific non-versioned commit of BeetPx in a game
#   repository.
npm run compile

if [ "$run_full_check" = "yes" ]; then
  # Generate up-to-date HTML documentation
  npm run docs:generate
fi

# Whatever was changed due to commands above, let's add it to the commit
git add --all .
