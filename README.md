Palette Color
=============

This Jquery Plugin is a simple palette color. See a [demo](https://laerciosantana.github.io/palette-color).

![Palette Color](https://raw.githubusercontent.com/LaercioSantana/palette-color/master/imgs/example.png)


Usage
-----

```js
<script src='palette.js'></script>
<link rel='stylesheet' href='palette.css' />

<div id="colorpicker"></div>

<script>
    var $palette = $("#colorpicker").paletteColor({
  		palette: [["#FFC0CB", "#FF99CC", "#FF6699", "#FF3366"],
                  ["#FFEFD5", "#FFCC33", "#FF9900", "#FF9933"],
                  ["#FFEACD", "#FFFF99", "#FFFF66", "#FFD700"],
                  ["#CCFFCC", "#CCFF66", "#99FF00", "#99CC00"]]
  		});
    $palette.paletteColor("position", {x:100, y:100});
    $palette.paletteColor("onColorSelected", function(color){
      console.log(color);
    });
</script>
```

Build
------
 * Fix dependencies. In palette color folder root:
 
 ```
    npm install -g grunt-cli
    npm install
 ```
 
 * Build:
 
 ```
    grunt
 ```

Docs
----- 
**Initialize palette color options**
    
```js
       $("#colorpicker").paletteColor({
            cellWidth: 12,
            cellHeight: 12,
      	  	recentLabel: "<b> Recent Colors Selected</b>",
            recentPalette: ['white', 'white'],
            palette: [['red', 'blue'], ['green', 'orange']]    
        });
```
    
* cellWidth <br />
  type: `interger` <br />
  description: width of color cell

* cellHeight <br />
  type: `interger` <br />
  description: height of color cell
  
* recentLabel <br />
  type: `string` <br />
  description: the title that appear on recent colors
  
* recentPalatte <br />
  type: `array` <br />
  description: Colors array that init recent colors
  
* palette <br />
  type: `array` <br />
  description: A multidimensional color array that contain the colors of the palette
  
**Show or hide** <br />
* value <br />
  type: `boolean`
```js
      var value = true;
      $("#colorpicker").paletteColor("show", value);
           
```

**Enable or disable drag** <br />
* value <br />
  type: `boolean`
```js
      var value = true;
      $("#colorpicker").paletteColor("dragable", value);
           
```

**Set position** <br />
* position <br />
  type: `{x:float, y: float}`
```js
      var position = {x: 120, y: 230};
      $("#colorpicker").paletteColor("position", position);
           
```

**Event when color selected** <br />
* action <br />
  type: `function`
```js
      var action = function(color){
        console.log(color);
      };
      $("#colorpicker").paletteColor("onColorSelected", action);
           
```
  
    
License
-------
The MIT License.

