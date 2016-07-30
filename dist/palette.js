function Palette(element, op) {
    this.element = element, this.palette = op.palette || [], this.recentLabel = op.recentLabel || "<b>Recent</b>", 
    this.recentPalette = op.recentPalette || new Array(this.palette[0].length), this.$palette, 
    this.cellWidth = op.cellWidth || 10, this.cellHeight = op.cellHeight || 10, this.$cellSelected, 
    this.onColorSelectedListeners = [], this.dragFunction = function(e) {
        if (1 == e.originalEvent.buttons) {
            var palette = this.$palette;
            palette.css("top", e.originalEvent.movementY + palette.position().top), palette.css("left", e.originalEvent.movementX + palette.position().left);
        }
    }.bind(this), this.__buildUI();
}

Palette.prototype = {
    __buildUI: function() {
        this.$palette = $(this.element), this.$palette.addClass("pc-palette");
        var checkmark = function(cell, color) {
            null != this.$cellSelected && this.$cellSelected.removeClass("pc-selected dark light"), 
            this.$cellSelected = $(cell), color.isDark() ? $(cell).addClass("pc-selected light") : $(cell).addClass("pc-selected dark");
        }.bind(this), recentColorsContainer = $("<div class='pc-recent-colors-container'>");
        recentColorsContainer.append($("<div class='pc-recent-label'>" + this.recentLabel + "</div>")), 
        this.__fillWithCells(recentColorsContainer, {
            x: this.cellWidth,
            y: this.cellHeight
        }, [ this.recentPalette ]), recentColorsContainer.find(".pc-thumb-el").click(function() {
            var color = tinycolor($(this).find(".pc-thumb-inner").css("background-color"));
            0 !== color._a && (checkmark(this, color), palette.__notifyColorSelected(color));
        }), this.$palette.append(recentColorsContainer);
        var colorsContainer = $("<div class='pc-colors-container'>");
        this.__fillWithCells(colorsContainer, {
            x: this.cellWidth,
            y: this.cellHeight
        }, this.palette);
        var palette = this;
        colorsContainer.find(".pc-thumb-el").click(function() {
            var color = tinycolor($(this).find(".pc-thumb-inner").css("background-color"));
            checkmark(this, color), palette.__addColorToRecent(color), palette.__notifyColorSelected(color);
        }), this.$palette.append(colorsContainer);
    },
    __fillWithCells: function(container, cell, colors) {
        for (var i = 0; i < colors.length; i++) {
            var activeRow = $("<div class='pc-row-" + i + "'>");
            container.append(activeRow);
            for (var j = 0; j < colors[i].length; j++) {
                var cell = $("<span class='pc-thumb-el'>"), cellInner = $("<span class='pc-thumb-inner'>");
                cellInner.css("background-color", colors[i][j]), activeRow.append(cell.append(cellInner));
            }
        }
    },
    show: function(value) {
        value ? this.$palette.removeClass("hidden") : this.$palette.addClass("hidden");
    },
    setPosition: function(p) {
        this.$palette.css("top", p.y), this.$palette.css("left", p.x);
    },
    setDragable: function(value) {
        value ? this.$palette.mousemove(this.dragFunction) : this.$palette.off("mousemove", this.dragFunction);
    },
    addOnColorSelected: function(listener) {
        this.onColorSelectedListeners.push(listener);
    },
    resetRecentColors: function() {
        for (var i = this.recentPalette.length - 1; i > -1; i--) this.__addColorToRecent(new tinycolor(this.recentPalette[i]));
    },
    __notifyColorSelected: function(color) {
        for (var i = 0; i < this.onColorSelectedListeners.length; i++) this.onColorSelectedListeners[i](color);
    },
    __addColorToRecent: function(color) {
        var cellsInners = $(".pc-recent-colors-container .pc-thumb-el .pc-thumb-inner");
        cellsInners = $(cellsInners.get().reverse()), cellsInners.each(function(i, el) {
            i < cellsInners.length - 1 && $(this).css("background-color", $(cellsInners[i + 1]).css("background-color"));
        }), $(cellsInners[cellsInners.length - 1]).css("background-color", color._originalInput);
    }
}, function(Math) {
    function tinycolor(color, opts) {
        if (color = color ? color : "", opts = opts || {}, color instanceof tinycolor) return color;
        if (!(this instanceof tinycolor)) return new tinycolor(color, opts);
        var rgb = inputToRGB(color);
        this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, 
        this._a = rgb.a, this._roundA = mathRound(100 * this._a) / 100, this._format = opts.format || rgb.format, 
        this._gradientType = opts.gradientType, this._r < 1 && (this._r = mathRound(this._r)), 
        this._g < 1 && (this._g = mathRound(this._g)), this._b < 1 && (this._b = mathRound(this._b)), 
        this._ok = rgb.ok, this._tc_id = tinyCounter++;
    }
    function inputToRGB(color) {
        var rgb = {
            r: 0,
            g: 0,
            b: 0
        }, a = 1, s = null, v = null, l = null, ok = !1, format = !1;
        return "string" == typeof color && (color = stringInputToObject(color)), "object" == typeof color && (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b) ? (rgb = rgbToRgb(color.r, color.g, color.b), 
        ok = !0, format = "%" === String(color.r).substr(-1) ? "prgb" : "rgb") : isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v) ? (s = convertToPercentage(color.s), 
        v = convertToPercentage(color.v), rgb = hsvToRgb(color.h, s, v), ok = !0, format = "hsv") : isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l) && (s = convertToPercentage(color.s), 
        l = convertToPercentage(color.l), rgb = hslToRgb(color.h, s, l), ok = !0, format = "hsl"), 
        color.hasOwnProperty("a") && (a = color.a)), a = boundAlpha(a), {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }
    function rgbToRgb(r, g, b) {
        return {
            r: 255 * bound01(r, 255),
            g: 255 * bound01(g, 255),
            b: 255 * bound01(b, 255)
        };
    }
    function rgbToHsl(r, g, b) {
        r = bound01(r, 255), g = bound01(g, 255), b = bound01(b, 255);
        var h, s, max = mathMax(r, g, b), min = mathMin(r, g, b), l = (max + min) / 2;
        if (max == min) h = s = 0; else {
            var d = max - min;
            switch (s = l > .5 ? d / (2 - max - min) : d / (max + min), max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

              case g:
                h = (b - r) / d + 2;
                break;

              case b:
                h = (r - g) / d + 4;
            }
            h /= 6;
        }
        return {
            h: h,
            s: s,
            l: l
        };
    }
    function hslToRgb(h, s, l) {
        function hue2rgb(p, q, t) {
            return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? p + 6 * (q - p) * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
        }
        var r, g, b;
        if (h = bound01(h, 360), s = bound01(s, 100), l = bound01(l, 100), 0 === s) r = g = b = l; else {
            var q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3), g = hue2rgb(p, q, h), b = hue2rgb(p, q, h - 1 / 3);
        }
        return {
            r: 255 * r,
            g: 255 * g,
            b: 255 * b
        };
    }
    function rgbToHsv(r, g, b) {
        r = bound01(r, 255), g = bound01(g, 255), b = bound01(b, 255);
        var h, s, max = mathMax(r, g, b), min = mathMin(r, g, b), v = max, d = max - min;
        if (s = 0 === max ? 0 : d / max, max == min) h = 0; else {
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

              case g:
                h = (b - r) / d + 2;
                break;

              case b:
                h = (r - g) / d + 4;
            }
            h /= 6;
        }
        return {
            h: h,
            s: s,
            v: v
        };
    }
    function hsvToRgb(h, s, v) {
        h = 6 * bound01(h, 360), s = bound01(s, 100), v = bound01(v, 100);
        var i = Math.floor(h), f = h - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), mod = i % 6, r = [ v, q, p, p, t, v ][mod], g = [ t, v, v, q, p, p ][mod], b = [ p, p, t, v, v, q ][mod];
        return {
            r: 255 * r,
            g: 255 * g,
            b: 255 * b
        };
    }
    function rgbToHex(r, g, b, allow3Char) {
        var hex = [ pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16)) ];
        return allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) ? hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) : hex.join("");
    }
    function rgbaToHex(r, g, b, a, allow4Char) {
        var hex = [ pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16)), pad2(convertDecimalToHex(a)) ];
        return allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1) ? hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0) : hex.join("");
    }
    function rgbaToArgbHex(r, g, b, a) {
        var hex = [ pad2(convertDecimalToHex(a)), pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16)) ];
        return hex.join("");
    }
    function desaturate(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        return hsl.s -= amount / 100, hsl.s = clamp01(hsl.s), tinycolor(hsl);
    }
    function saturate(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        return hsl.s += amount / 100, hsl.s = clamp01(hsl.s), tinycolor(hsl);
    }
    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }
    function lighten(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        return hsl.l += amount / 100, hsl.l = clamp01(hsl.l), tinycolor(hsl);
    }
    function brighten(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var rgb = tinycolor(color).toRgb();
        return rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100)))), 
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100)))), rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100)))), 
        tinycolor(rgb);
    }
    function darken(color, amount) {
        amount = 0 === amount ? 0 : amount || 10;
        var hsl = tinycolor(color).toHsl();
        return hsl.l -= amount / 100, hsl.l = clamp01(hsl.l), tinycolor(hsl);
    }
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl(), hue = (hsl.h + amount) % 360;
        return hsl.h = hue < 0 ? 360 + hue : hue, tinycolor(hsl);
    }
    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        return hsl.h = (hsl.h + 180) % 360, tinycolor(hsl);
    }
    function triad(color) {
        var hsl = tinycolor(color).toHsl(), h = hsl.h;
        return [ tinycolor(color), tinycolor({
            h: (h + 120) % 360,
            s: hsl.s,
            l: hsl.l
        }), tinycolor({
            h: (h + 240) % 360,
            s: hsl.s,
            l: hsl.l
        }) ];
    }
    function tetrad(color) {
        var hsl = tinycolor(color).toHsl(), h = hsl.h;
        return [ tinycolor(color), tinycolor({
            h: (h + 90) % 360,
            s: hsl.s,
            l: hsl.l
        }), tinycolor({
            h: (h + 180) % 360,
            s: hsl.s,
            l: hsl.l
        }), tinycolor({
            h: (h + 270) % 360,
            s: hsl.s,
            l: hsl.l
        }) ];
    }
    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl(), h = hsl.h;
        return [ tinycolor(color), tinycolor({
            h: (h + 72) % 360,
            s: hsl.s,
            l: hsl.l
        }), tinycolor({
            h: (h + 216) % 360,
            s: hsl.s,
            l: hsl.l
        }) ];
    }
    function analogous(color, results, slices) {
        results = results || 6, slices = slices || 30;
        var hsl = tinycolor(color).toHsl(), part = 360 / slices, ret = [ tinycolor(color) ];
        for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) hsl.h = (hsl.h + part) % 360, 
        ret.push(tinycolor(hsl));
        return ret;
    }
    function monochromatic(color, results) {
        results = results || 6;
        for (var hsv = tinycolor(color).toHsv(), h = hsv.h, s = hsv.s, v = hsv.v, ret = [], modification = 1 / results; results--; ) ret.push(tinycolor({
            h: h,
            s: s,
            v: v
        })), v = (v + modification) % 1;
        return ret;
    }
    function flip(o) {
        var flipped = {};
        for (var i in o) o.hasOwnProperty(i) && (flipped[o[i]] = i);
        return flipped;
    }
    function boundAlpha(a) {
        return a = parseFloat(a), (isNaN(a) || a < 0 || a > 1) && (a = 1), a;
    }
    function bound01(n, max) {
        isOnePointZero(n) && (n = "100%");
        var processPercent = isPercentage(n);
        return n = mathMin(max, mathMax(0, parseFloat(n))), processPercent && (n = parseInt(n * max, 10) / 100), 
        Math.abs(n - max) < 1e-6 ? 1 : n % max / parseFloat(max);
    }
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }
    function isOnePointZero(n) {
        return "string" == typeof n && n.indexOf(".") != -1 && 1 === parseFloat(n);
    }
    function isPercentage(n) {
        return "string" == typeof n && n.indexOf("%") != -1;
    }
    function pad2(c) {
        return 1 == c.length ? "0" + c : "" + c;
    }
    function convertToPercentage(n) {
        return n <= 1 && (n = 100 * n + "%"), n;
    }
    function convertDecimalToHex(d) {
        return Math.round(255 * parseFloat(d)).toString(16);
    }
    function convertHexToDecimal(h) {
        return parseIntFromHex(h) / 255;
    }
    function isValidCSSUnit(color) {
        return !!matchers.CSS_UNIT.exec(color);
    }
    function stringInputToObject(color) {
        color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
        var named = !1;
        if (names[color]) color = names[color], named = !0; else if ("transparent" == color) return {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            format: "name"
        };
        var match;
        return (match = matchers.rgb.exec(color)) ? {
            r: match[1],
            g: match[2],
            b: match[3]
        } : (match = matchers.rgba.exec(color)) ? {
            r: match[1],
            g: match[2],
            b: match[3],
            a: match[4]
        } : (match = matchers.hsl.exec(color)) ? {
            h: match[1],
            s: match[2],
            l: match[3]
        } : (match = matchers.hsla.exec(color)) ? {
            h: match[1],
            s: match[2],
            l: match[3],
            a: match[4]
        } : (match = matchers.hsv.exec(color)) ? {
            h: match[1],
            s: match[2],
            v: match[3]
        } : (match = matchers.hsva.exec(color)) ? {
            h: match[1],
            s: match[2],
            v: match[3],
            a: match[4]
        } : (match = matchers.hex8.exec(color)) ? {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        } : (match = matchers.hex6.exec(color)) ? {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        } : (match = matchers.hex4.exec(color)) ? {
            r: parseIntFromHex(match[1] + "" + match[1]),
            g: parseIntFromHex(match[2] + "" + match[2]),
            b: parseIntFromHex(match[3] + "" + match[3]),
            a: convertHexToDecimal(match[4] + "" + match[4]),
            format: named ? "name" : "hex8"
        } : !!(match = matchers.hex3.exec(color)) && {
            r: parseIntFromHex(match[1] + "" + match[1]),
            g: parseIntFromHex(match[2] + "" + match[2]),
            b: parseIntFromHex(match[3] + "" + match[3]),
            format: named ? "name" : "hex"
        };
    }
    function validateWCAG2Parms(parms) {
        var level, size;
        return parms = parms || {
            level: "AA",
            size: "small"
        }, level = (parms.level || "AA").toUpperCase(), size = (parms.size || "small").toLowerCase(), 
        "AA" !== level && "AAA" !== level && (level = "AA"), "small" !== size && "large" !== size && (size = "small"), 
        {
            level: level,
            size: size
        };
    }
    var trimLeft = /^\s+/, trimRight = /\s+$/, tinyCounter = 0, mathRound = Math.round, mathMin = Math.min, mathMax = Math.max, mathRandom = Math.random;
    tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getOriginalInput: function() {
            return this._originalInput;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            var rgb = this.toRgb();
            return (299 * rgb.r + 587 * rgb.g + 114 * rgb.b) / 1e3;
        },
        getLuminance: function() {
            var RsRGB, GsRGB, BsRGB, R, G, B, rgb = this.toRgb();
            return RsRGB = rgb.r / 255, GsRGB = rgb.g / 255, BsRGB = rgb.b / 255, R = RsRGB <= .03928 ? RsRGB / 12.92 : Math.pow((RsRGB + .055) / 1.055, 2.4), 
            G = GsRGB <= .03928 ? GsRGB / 12.92 : Math.pow((GsRGB + .055) / 1.055, 2.4), B = BsRGB <= .03928 ? BsRGB / 12.92 : Math.pow((BsRGB + .055) / 1.055, 2.4), 
            .2126 * R + .7152 * G + .0722 * B;
        },
        setAlpha: function(value) {
            return this._a = boundAlpha(value), this._roundA = mathRound(100 * this._a) / 100, 
            this;
        },
        toHsv: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return {
                h: 360 * hsv.h,
                s: hsv.s,
                v: hsv.v,
                a: this._a
            };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b), h = mathRound(360 * hsv.h), s = mathRound(100 * hsv.s), v = mathRound(100 * hsv.v);
            return 1 == this._a ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return {
                h: 360 * hsl.h,
                s: hsl.s,
                l: hsl.l,
                a: this._a
            };
        },
        toHslString: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b), h = mathRound(360 * hsl.h), s = mathRound(100 * hsl.s), l = mathRound(100 * hsl.l);
            return 1 == this._a ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
        },
        toHex: function(allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
            return "#" + this.toHex(allow3Char);
        },
        toHex8: function(allow4Char) {
            return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
        },
        toHex8String: function(allow4Char) {
            return "#" + this.toHex8(allow4Char);
        },
        toRgb: function() {
            return {
                r: mathRound(this._r),
                g: mathRound(this._g),
                b: mathRound(this._b),
                a: this._a
            };
        },
        toRgbString: function() {
            return 1 == this._a ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return {
                r: mathRound(100 * bound01(this._r, 255)) + "%",
                g: mathRound(100 * bound01(this._g, 255)) + "%",
                b: mathRound(100 * bound01(this._b, 255)) + "%",
                a: this._a
            };
        },
        toPercentageRgbString: function() {
            return 1 == this._a ? "rgb(" + mathRound(100 * bound01(this._r, 255)) + "%, " + mathRound(100 * bound01(this._g, 255)) + "%, " + mathRound(100 * bound01(this._b, 255)) + "%)" : "rgba(" + mathRound(100 * bound01(this._r, 255)) + "%, " + mathRound(100 * bound01(this._g, 255)) + "%, " + mathRound(100 * bound01(this._b, 255)) + "%, " + this._roundA + ")";
        },
        toName: function() {
            return 0 === this._a ? "transparent" : !(this._a < 1) && (hexNames[rgbToHex(this._r, this._g, this._b, !0)] || !1);
        },
        toFilter: function(secondColor) {
            var hex8String = "#" + rgbaToArgbHex(this._r, this._g, this._b, this._a), secondHex8String = hex8String, gradientType = this._gradientType ? "GradientType = 1, " : "";
            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = "#" + rgbaToArgbHex(s._r, s._g, s._b, s._a);
            }
            return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
        },
        toString: function(format) {
            var formatSet = !!format;
            format = format || this._format;
            var formattedString = !1, hasAlpha = this._a < 1 && this._a >= 0, needsAlphaFormat = !formatSet && hasAlpha && ("hex" === format || "hex6" === format || "hex3" === format || "hex4" === format || "hex8" === format || "name" === format);
            return needsAlphaFormat ? "name" === format && 0 === this._a ? this.toName() : this.toRgbString() : ("rgb" === format && (formattedString = this.toRgbString()), 
            "prgb" === format && (formattedString = this.toPercentageRgbString()), "hex" !== format && "hex6" !== format || (formattedString = this.toHexString()), 
            "hex3" === format && (formattedString = this.toHexString(!0)), "hex4" === format && (formattedString = this.toHex8String(!0)), 
            "hex8" === format && (formattedString = this.toHex8String()), "name" === format && (formattedString = this.toName()), 
            "hsl" === format && (formattedString = this.toHslString()), "hsv" === format && (formattedString = this.toHsvString()), 
            formattedString || this.toHexString());
        },
        clone: function() {
            return tinycolor(this.toString());
        },
        _applyModification: function(fn, args) {
            var color = fn.apply(null, [ this ].concat([].slice.call(args)));
            return this._r = color._r, this._g = color._g, this._b = color._b, this.setAlpha(color._a), 
            this;
        },
        lighten: function() {
            return this._applyModification(lighten, arguments);
        },
        brighten: function() {
            return this._applyModification(brighten, arguments);
        },
        darken: function() {
            return this._applyModification(darken, arguments);
        },
        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },
        spin: function() {
            return this._applyModification(spin, arguments);
        },
        _applyCombination: function(fn, args) {
            return fn.apply(null, [ this ].concat([].slice.call(args)));
        },
        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },
        complement: function() {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    }, tinycolor.fromRatio = function(color, opts) {
        if ("object" == typeof color) {
            var newColor = {};
            for (var i in color) color.hasOwnProperty(i) && ("a" === i ? newColor[i] = color[i] : newColor[i] = convertToPercentage(color[i]));
            color = newColor;
        }
        return tinycolor(color, opts);
    }, tinycolor.equals = function(color1, color2) {
        return !(!color1 || !color2) && tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    }, tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    }, tinycolor.mix = function(color1, color2, amount) {
        amount = 0 === amount ? 0 : amount || 50;
        var rgb1 = tinycolor(color1).toRgb(), rgb2 = tinycolor(color2).toRgb(), p = amount / 100, rgba = {
            r: (rgb2.r - rgb1.r) * p + rgb1.r,
            g: (rgb2.g - rgb1.g) * p + rgb1.g,
            b: (rgb2.b - rgb1.b) * p + rgb1.b,
            a: (rgb2.a - rgb1.a) * p + rgb1.a
        };
        return tinycolor(rgba);
    }, tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1), c2 = tinycolor(color2);
        return (Math.max(c1.getLuminance(), c2.getLuminance()) + .05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + .05);
    }, tinycolor.isReadable = function(color1, color2, wcag2) {
        var wcag2Parms, out, readability = tinycolor.readability(color1, color2);
        switch (out = !1, wcag2Parms = validateWCAG2Parms(wcag2), wcag2Parms.level + wcag2Parms.size) {
          case "AAsmall":
          case "AAAlarge":
            out = readability >= 4.5;
            break;

          case "AAlarge":
            out = readability >= 3;
            break;

          case "AAAsmall":
            out = readability >= 7;
        }
        return out;
    }, tinycolor.mostReadable = function(baseColor, colorList, args) {
        var readability, includeFallbackColors, level, size, bestColor = null, bestScore = 0;
        args = args || {}, includeFallbackColors = args.includeFallbackColors, level = args.level, 
        size = args.size;
        for (var i = 0; i < colorList.length; i++) readability = tinycolor.readability(baseColor, colorList[i]), 
        readability > bestScore && (bestScore = readability, bestColor = tinycolor(colorList[i]));
        return tinycolor.isReadable(baseColor, bestColor, {
            level: level,
            size: size
        }) || !includeFallbackColors ? bestColor : (args.includeFallbackColors = !1, tinycolor.mostReadable(baseColor, [ "#fff", "#000" ], args));
    };
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    }, hexNames = tinycolor.hexNames = flip(names), matchers = function() {
        var CSS_INTEGER = "[-\\+]?\\d+%?", CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?", CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")", PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?", PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        return {
            CSS_UNIT: new RegExp(CSS_UNIT),
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    }();
    "undefined" != typeof module && module.exports ? module.exports = tinycolor : "function" == typeof define && define.amd ? define(function() {
        return tinycolor;
    }) : window.tinycolor = tinycolor;
}(Math);