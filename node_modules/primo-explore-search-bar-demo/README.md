# Adding a search bar information panel - Demo


##Usage

- add a package.json file in your customization package folder root.

For example, if you are developing a package for the Auto1 view

- Add the file under *primo-explore-devenv/primo-explore/custom/Auto1*

- The content of the file should be:

```
{
  "name": "<your view code>",
  "version": "<your version>",
  "description": "",
  "author": "",
  "devDependencies": {
    "primo-explore-search-bar-demo": "0.0.1"
  }
}
```

- go to your command line (in windows: type cmd in the start > run box)
- navigate to the location of the package.json file
   
   ```
      cd primo-explore-devenv/primo-explore/custom/Auto1
   ```
- type npm install
- you will se a new folder was added in the same location named node_modules
- Now you can see the widget in your enviornment
