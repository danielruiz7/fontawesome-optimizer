## Introduction

So you use some [fontawesome](https://fontawesome.com/) icons in your project but there is a problem: fontawesome-all.js size is 3MB (too much). 

With this node.js program you can generate an optimized version of fontawesome.js with only the icons use in your project.

## Usage

Run 

```
node index.js path_to_your_project_directory path_to_output_file
```

The script will iterate over the .html files in your project looking for icons in the format 
```
<i class="faX fa-XXX"></i>
``` 
then it will generate a file with only thoose icons.
