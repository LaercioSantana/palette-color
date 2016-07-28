function Palette(element, op){
	this.element = element;
	this.palette = op.palette || [];
	this.recentLabel = op.recentLabel || "<b>Recent</b>";
	this.$palette;

	this.cellWidth = op.cellWidth || 10;
	this.cellHeight = op.cellHeight || 10;
	this.$cellSelected;

	this.onColorSelectedListeners = [];

	this.dragFunction = function(e) {
						if(e.originalEvent.buttons == 1){
							var palette = this.$palette;
						    palette.css("top", e.originalEvent.movementY + palette.position().top);
						    palette.css("left", e.originalEvent.movementX + palette.position().left);
						}
					 }.bind(this);
	
	this.__buildUI();
}
Palette.prototype = {
	__buildUI: function(){
		this.$palette = $(this.element);
		this.$palette.addClass("pc-palette");

		var checkmark = function(cell, color){
			//remove old checkmark
			if(this.$cellSelected != null)
				this.$cellSelected.removeClass("pc-selected dark light");
			
			this.$cellSelected = $(cell);

			if(color.isDark())
				$(cell).addClass("pc-selected light");
			else 
				$(cell).addClass("pc-selected dark");
		}.bind(this);

		//build recent colors
		var recentColorsContainer = $("<div class='pc-recent-colors-container'>");
		recentColorsContainer.append($("<div class='pc-recent-label'>"+this.recentLabel+"</div>"))
		this.__fillWithCells(recentColorsContainer, {x:this.cellWidth, y:this.cellHeight}, [new Array(this.palette[0].length)]);
		recentColorsContainer.find(".pc-thumb-el").click(function(){
			var color = tinycolor($(this).find(".pc-thumb-inner").css("background-color"));
			if(color._a !== 0){
				checkmark(this, color);
				palette.__notifyColorSelected(color);
			}
		});
		this.$palette.append(recentColorsContainer);


		//build colors container
		var colorsContainer = $("<div class='pc-colors-container'>");
		this.__fillWithCells(colorsContainer, {x: this.cellWidth, y: this.cellHeight}, this.palette);

		var palette = this;//save palette instace for use in cell onclik 
		colorsContainer.find(".pc-thumb-el").click(function(){
			var color = tinycolor($(this).find(".pc-thumb-inner").css("background-color"));
			checkmark(this, color);
			palette.__addColorToRecent(color);
			palette.__notifyColorSelected(color);
		});

		this.$palette.append(colorsContainer);
	},
	__fillWithCells: function(container, cell, colors){
		for(var i = 0; i < colors.length; i++){
			//add row
			var activeRow = $("<div class='pc-row-"+i+"'>");
			container.append(activeRow);

			for(var j = 0; j < colors[i].length; j++){
				//make color cell
				var cell = $("<span class='pc-thumb-el'>");
				var cellInner = $("<span class='pc-thumb-inner'>");
				cellInner.css("background-color", colors[i][j]);
				activeRow.append(cell.append(cellInner));
			}
		}
	},
	show: function(value){
		if(value)
			this.$palette.removeClass("hidden");
		else
			this.$palette.addClass("hidden");
	},
	setPosition: function(p){
		this.$palette.css("top", p.y);
		this.$palette.css("left", p.x);
	},
	setDragable: function(value){
		if(value)
			this.$palette.mousemove(this.dragFunction);
		else
			this.$palette.off("mousemove", this.dragFunction);
	},
	addOnColorSelected: function(listener){
		this.onColorSelectedListeners.push(listener);
	},
	__notifyColorSelected: function(color){
		for(var i = 0; i < this.onColorSelectedListeners.length; i++)
			this.onColorSelectedListeners[i](color);
	},
	__addColorToRecent:function(color){
		var cellsInners = $(".pc-recent-colors-container .pc-thumb-el .pc-thumb-inner");
		cellsInners = $(cellsInners.get().reverse());
		
		cellsInners.each(function(i, el){
			if(i < cellsInners.length - 1)
				$(this).css("background-color", $(cellsInners[i+1]).css("background-color"));
		});

		$(cellsInners[cellsInners.length -1]).css("background-color", color._originalInput);
	}
}