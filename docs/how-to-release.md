# How to release a new version of Reef Knot
The [Changesets](https://github.com/changesets/changesets) tool is used for publishing new versions.

### 1. Add changesets
A changeset is a generated file with a unique random name,
containing information about what packages were updated and the changes' description.  
Run `changeset` command from the project's root and answer questions in the CLI to generate a changeset file.  
You can generate one changeset for all changes. Or, if you want, you can generate several changesets.
For example, a separate changeset for each logical set of changes, or a dedicated changeset for each updated package.  
Changesets are placed in the `.changeset` directory.

### 2. Bump package versions
Once you decide you are ready to do a release, you can run `changeset version`.  
This consumes all changesets, and updates packages to the most appropriate semver version based on those changesets.
It also writes changelog entries for each consumed changeset.  
Please, review both the changelog entries and the updated version, check that they meet expectations.
Note, that this step can't be automated via CI in this project because of security rules (bots do not have write access to files).

### 3. Commit and push
Commit the versions update and push it.
After the PR is merged, a GitHub workflow will trigger the `changeset publish` command,
which will attempt to publish `reef-knot` and its subpackages under the versions specified in the PR.    
Ensure that the workflow successfully finished and the new versions of packages are published.
