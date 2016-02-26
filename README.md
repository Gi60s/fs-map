# fs-map

Get a map of the file system with information about the files at each path. The information populated is that which is returned from Node's fs.stat function.

## Installation

```bash
npm install fs-map
```

## Usage
```js
var fsMap = require('fs-map');

// assume for this example that /directory/to/map has one file called file.txt
fsMap('/directory/to/map', { absolutePaths: false }, function(err, data) {
    console.log(data['file.txt'].isFile());     // true
});
```

## API

#### fsMap ( directoryPath [, configuration ] [, callback ] )

**Parameters**

- **directoryPath** (string, required) - The file path to a directory that will be used as the root directory to build the file system map for.
- **configuration** (object, optional) - The configuration object to define how the map should be built.
- **callback** (function, optional) - A callback function to call with the file system map result. If this paramter is not used then the function will return a promise.

**Configuration Options**

- **absolutePath** - Whether to map the file stats by absolute path (`true`) or relative path (`false`). Defaults to `true`.
- **depth** - How deep to map directories (including sub-directories). Defaults to `-1` for unlimited depth.
- **filter** - A function that must return true to include a file or directory on the map. This function receives two parameters: 1) filePath, 2) stats. Defaults to `function(path, stats) { return true; }`

**Returns** nothing if a callback is specified or a Promise object if the callback function is omitted.