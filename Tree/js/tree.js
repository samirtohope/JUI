(function($) {
	var Defaults = {
			dynamic: false, // false静态解析树， true动态创建树
			treeData: false, // 动态创建树且是一次读入数据时需要的JSON数据
			animate: false, // 动画开关
			checkType:'none', // none|radio|checkbox
			parentCheck: true, // 父级是否可选，多选时有用，true 可选父级，false 禁选父级
			cls: '', // 自定义classname和.treeview同级

			// 初始化时触发
			init: function(Tree) {

			},
			/**
			 * function active
			 * TODO: 点击文本区域时的回调
			 * 		@param {[Object]} [Tree] 当前的Tree对象
			 *      @param {[JQuery selector]} [dataNode] 存放数据的jQuery Selector,返回选择器对象的好处是可以自由或许数据，1、data('dataObject') 2、attr('data-text')
			 *      @return {boolean} 如果该节点是链接并且要阻止链接跳转，则需要返回false。
			 */
			active: function(dataNode, Tree) {
				return true;
			}, 
			/**
			 * [多选框选中或取消时的回调]
			 * @return {[Selector]} checkbox [已选的checkbox]
			 * @param  {[Selector]} dataNode [当前多选框]
			 * @param  {[Array]} checkeds [存放数据节点]
			 * @param  {[Boolean]} status   [true 选中，false取消]
			 * @param  {[Object]} Tree     [Tree对象]
			 */
			check: function(checkbox, dataNode, checkeds, status, Tree) {

			}
		},

		Classes = {
			rootClass: 'treeview',
			expand: 'expand',
			collapse: 'collapse',
			hitarea: 'hitarea',
			radio: 'radio',
			checkbox: 'checkbox',
			childUl: 'tree-child',
			childLi: 'tree-node'
		}

	function Tree(container, options) {
		this.setCacheElement('container', container);
		this.settings = $.extend({}, Defaults, options||{});

		// 初始化rootree
		var treeview = this.container.find('.'+Classes['rootClass']);
		if(treeview[0]) {
			this.setCacheElement('rootree', treeview);
		} else {
			treeview = this.createRoot();
		}
		treeview.addClass(this.settings['cls']);

		if(this.settings.checkType == 'checkbox' || this.settings.checkType == 'radio') {
			CheckWidget.call(this);
		}

		this.initialization();
	}

	Tree.prototype = {

		constructor: Tree,

		initialization : function() {
			var $this = this;
			
			this.settings.init(this);
			if(this.settings.dynamic === false)
			{
				if(!this.rootree) return;
				var hitareaes = this.rootree.find('.'+Classes['hitarea']);
				if(hitareaes.length > 0) {
					hitareaes.each(function(i, divHitarea) {
						$this.bindHitarea($(divHitarea));
					});
				}
				
				$.each(this.rootree.find('.operate'), function(i, operate){
					$this.hoverClass($(operate),'hover');
				});

				$.each(this.rootree.find('.text'), function(i, text){
					$this.bindText($(text));
				});

				if(this.settings.checkType == 'checkbox' || this.settings.checkType == 'radio') {
					this.findChecks();
				}
			} else if(this.settings.treeData != false && this.settings.treeData.length != 0) {
				this.loadOnce(this.settings.treeData);
			} else if(this.settings.ajax) {
				this.load = this.getData(function(data, parent) {
					$this.addItem(data, parent);
					parent.data('state','success');
					$this.controlExpandCollapse(parent.find('>.operate>.hitarea'));
				});
				this.load(this.rootree);
			}
		},

		setCacheElement: function(name, selector) {
			this[name] = selector;
		},

		hoverClass: function(el, className) {
			el.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},

		bindHitarea: function(elem) {
			var $this = this;
			elem.click(function(e) {
				if($this.settings.ajax) {
					var li = elem.parent().parent();
					if(!li.data('loaded') || li.data('state') != 'success') {
						var primary = $this.settings.ajax.params.primary,
							id = elem.parent().data('dataObject')[primary];
						li.data('loaded', true);
						$this.load(li, id);
					} else {
						if(li.data('state') == 'success') $this.controlExpandCollapse(elem);
					}
				} else {
					$this.controlExpandCollapse(elem, e);
				}
			});
		},
		bindText: function(text) {
			var $this = this;
			text.click(function() {
				var r = $this.settings.active($(this).parent(), $this);
				if(typeof r === 'boolean') return r;
			});
		},

		controlExpandCollapse: function(el, e) {
			var operate = el.parent();
			operate.hasClass(Classes['expand']) ? this.elastic(operate,'collapse') : this.elastic(operate,'expand');
		},

		// expand and collapse
		elastic: function(operate, ec) {
			operate
				.removeClass(Classes[ec == 'expand' ? 'collapse' : 'expand'])
				.addClass(Classes[ec == 'expand' ? 'expand' : 'collapse']);
			var ul = operate.next();
			var toggle = function(el) {
				el[ec == 'expand' ? 'removeClass' : 'addClass']('hide');
			}
			this.settings.animate ? ul.animate({ height: "toggle" }, 'fast', function() {
				toggle($(this));
			}) : toggle(ul);
		},

		// 创建ul.treeview
		createRoot: function() {
			var rootStr = '<ul class="'+Classes['rootClass']+' '+this.settings['cls']+'"></ul>';
			var root = $(rootStr).appendTo(this.container);
			this.setCacheElement('rootree', root);
			return root;
		},
		// 添加子节点的ul.tree-child
		addChildUl: function(parentEl) {
			var ul = $('<ul class="'+Classes['childUl']+'"></ul>');
			parentEl.append(ul);
			return ul;
		},
		// 创建子节点li.tree-node
		addChildLi: function(parentNode, dataItem) {
			var hasHitarea = dataItem['hasChild'] == true ? true : false,
				node       =   $('<li class="tree-node"></li>'),
				operate    =   $('<div class="operate '+(hasHitarea == true ? Classes['collapse'] : '')+'" data-id="'+dataItem['catid']+'"></div>'),
				ico        =   $('<div class="ico"></div>'),
				text       =   $('<a href="" title="" class="text">'+dataItem['name']+'</a>');
			
			if(hasHitarea == true) {
				this.addHitarea(operate);
			}

			if(this.settings.checkType == "checkbox" || this.settings.checkType == "radio") {
				if(this.settings.parentCheck == false) {
					this.createCheckWidget(operate, hasHitarea ? true : false);
				} else {
					this.createCheckWidget(operate);
				}
			}

			operate
				.append(ico)
				.append(text);
			node.append(operate);
			this.hoverClass(operate, 'hover');

			this.bindText(text);

			var dataObject = {};
			for(var k in dataItem) {
				if(k != 'childs') {
					dataObject[k] = dataItem[k];
				}
			}
			operate.data('dataObject', dataObject);

			parentNode.append(node);
			return node;
		},
		addHitarea: function(parent) {
			var hitarea = $('<div class="hitarea"></div>');
			var first = parent.find(':first-child');
			first[0] ? first.before(hitarea) : parent.append(hitarea);
			this.bindHitarea(hitarea);
			return hitarea;
		},

		// 一次性加载
		loadOnce: function(dataJson, parent) {
			var $this = this;
			if(!this.rootree) {
				$this.createRoot();
			}
			$.each(dataJson, function(i, rootItem) {
				var rootLi = $this.addChildLi(parent||$this.rootree, rootItem);
				if(rootItem['childs'].length > 0) {
					$this.appendChilds(rootLi, rootItem['childs']);
				}
			});
		},
		appendChilds: function(parent, dataJson) {
			var $this = this;
			var ul = $this.addChildUl(parent).addClass('hide');
			$.each(dataJson, function(i, dataItem) {
				var li = $this.addChildLi(ul, dataItem);
				if(dataItem['childs'].length > 0) {
					$this.appendChilds(li,dataItem['childs']);
				}
			});
		},

		addItem: function(dataJson, parent) {
			if(parent[0] == this.rootree[0]) {
				this.loadOnce(dataJson, parent);
			} else if(parent.find('>.tree-child').length > 0) {
				this.loadOnce(dataJson, parent.find('>.tree-child'));
			} else {
				// 若不存在hitarea，则添加
				if(parent.find('>.operate>.hitarea').length == 0) {
					this.addHitarea(parent.find('.operate')).parent().addClass('expand');
				}
				this.loadOnce(dataJson, this.addChildUl(parent));
			}
		}
	}

	function CheckWidget() {
		this.checkeds = [];
	}
	CheckWidget.prototype = {
		save: function(checkbox) {
			for(var i = 0, len = this.checkeds.length; i < len; i++) {
				if(checkbox[0] === this.checkeds[i][0]) {
					return;
				}
			}
			checkbox.attr('data-i', len);
			this.checkeds.push(checkbox);
		},
		remove: function(checkbox) {
			var i = parseInt(checkbox.attr('data-i'), 10);
			this.checkeds.splice(i, 1);
			checkbox.removeAttr('data-i');
		},
		getChecked: function() {
			return this.checkeds;
		},
		findChecks: function() {
			var $this = this;
			this.rootree.find('.'+Classes[$this.settings.checkType]);
			$.each(this.rootree.find('.'+Classes[$this.settings.checkType]), function(i, cb) {
				var checkbox = $(cb);
				if($this.settings.parentCheck == false) {
					var li = checkbox.parent().parent(), disable = li.find('>.tree-child').length > 0;
					if(disable) {
						$this.updateStyle(checkbox, 'disable');
						return ;
					}
				}
				$this.bindCheckWidget(checkbox);
				$this.setCheckboxStatus(checkbox, false);
			});
		},
		createCheckWidget: function(parent, disable, beforeEl) {
			var checkbox = $('<div class="'+Classes[this.settings.checkType]+'"></div>');
			beforeEl ? beforeEl.before(checkbox) : parent.append(checkbox);
			if(disable === true) {
				this.updateStyle(checkbox, 'disable');
				return;
			}
			this.bindCheckWidget(checkbox);
			this.setCheckboxStatus(checkbox, false);
			return checkbox;
		},
		bindCheckWidget: function(checkbox) {
			var $this = this;
			checkbox.click(function() {
				$this.choose($(this));
			}).hover(function(){
				$this.updateStyle($(this), 'over');
			}, function(){
				$this.updateStyle($(this), 'out');
			});
		},
		choose: function(checkbox) {
			var status;
			if(checkbox.data('checked') == true) {
				this.unchecked(checkbox);
				status = 'unchecked';
			} else {
				this.checked(checkbox);
				status = 'checked';
			}
			if(this.settings.checkType == 'checkbox' && this.settings.parentCheck === true) {
				this.filter(checkbox, status); 
			} 
			this.settings.check(checkbox, checkbox.parent(), this.getChecked(), checkbox.data('checked') === true ? true : false, Tree);
		},
		checked: function(checkbox) {
			if(this.settings.checkType == 'radio') {
				this.sigle();
			}
			this.setCheckboxStatus(checkbox, true);
			this.updateStyle(checkbox, 'checked');
			this.save(checkbox);
		},
		unchecked: function(checkbox) {
			this.setCheckboxStatus(checkbox, false);
			this.updateStyle(checkbox, 'unchecked');
			this.remove(checkbox);
		},
		setCheckboxStatus: function(checkbox, status) {
			checkbox.data('checked', status);
		},
		hasChecked: function(checkbox) {
			return checkbox.data('checked');
		},
		thin: function(ctrol, checkbox) {
			if(ctrol == 'set') {
				this.updateStyle(checkbox, 'thin');
			} else if(ctrol == 'cancel') {
				this.updateStyle(checkbox, 'cancelthin');
			}
		},
		hasThin: function(checkbox) {
			return checkbox.hasClass('thin');
		},
		/*
		 * function filter 
		 * 所有父元素和子元素的操作（选中、取消、半选）
		 *  	选中
		 *  		遍历所有的子元素,使其选中
		 *  		遍历兄弟元素，若兄弟元素全部选中则父元素选中，否则父元素呈半选状态，逐级往上遍历至.treeview
		 *      取消选中
		 *      	所有子元素取消选中
		 *      	遍历兄弟元素,若全部兄弟元素都没有选中或没有半选，才能执行父元素的取消，逐级往上至根元素.treeview
		 		半选
		 			遍历兄弟元素，如果兄弟元素有一个为选中或半选，则父元素为半选，逐级往上至根元素.treeview
		 * 		    	
		 * @param  {[type]} checkbox [多选框]
		 * @param  {[type]} status   [选中checked || 取消unchecked]
		 */
		filter: function(checkbox, status) {
			this.childs(checkbox, status);
			this.parents(checkbox, status);
		},
		childs: function(checkbox, status) {
			var $this     = this,
				li        = checkbox.parent().parent(),
				childUl   = li.find('>.'+Classes['childUl']),
				hasChild  = childUl.length > 0 ? true : false;
			if(hasChild) {
				childUl.find('>.'+Classes['childLi']).each(function(i, liItem){
					var cb = $(liItem).find('>.operate>.'+Classes['checkbox']);
					$this[status](cb);
					$this.childs(cb,status);
				});
			}
		},
		parents: function(checkbox, status) {
			var $this      	   = this,
				li             = checkbox.parent().parent(),
				$siblings      = li.siblings(),
				hasSiblings    = $siblings.length > 0 ? true : false,
				allChecked     = true,
				othersCancel   = true,
				parentCheckbox = li.parent().parent().find('>.operate>.checkbox'),
				thinCheckbox   = null,
				step           = 0;
			
			if(hasSiblings) {
				for(var i = 0, len = $siblings.length; i < len; i++) {
					var cb = $siblings.eq(i).find('>.operate>.'+Classes['checkbox']);
					if(cb.data('checked') == false && status == 'checked') {
						allChecked = false;
						break;
					} 
					if(status == 'unchecked') {
						if(cb.data('checked') == true || $this.hasThin(cb)) {
							othersCancel = false;
							break;
						}
					}
				}
			} 
			
			if(status == 'checked' && allChecked == true) {
				$this[status](parentCheckbox);
				$this.thin('cancel',parentCheckbox);
				if(parentCheckbox[0]) $this.parents(parentCheckbox, status);
			} else {
				do {
					thinCheckbox = step == 0 ? parentCheckbox : thinCheckbox.parent().parent().parent().prev().find('>.checkbox');
					$this.thin('set', thinCheckbox);
					step++;
				}
				while(thinCheckbox[0]);	
			}
			
			if(status == 'unchecked') {
				$this.thin((othersCancel == true && !$this.hasThin(checkbox)) ? 'cancel' : 'set', parentCheckbox);
				if($this.hasChecked(parentCheckbox) == true) {
					$this[status](parentCheckbox);
				}
				if(parentCheckbox[0]) {
					$this.parents(parentCheckbox,status);
				} 
			}
		},
		updateStyle: function(checkbox, status) {
			var $this = this;
			switch(status) {
				case 'checked': 
					checkbox.addClass('checked');
					if($this.hasThin(checkbox)) checkbox.removeClass('thin');
				break;
				case 'unchecked': 
					checkbox.removeClass('checked');
				break;
				case 'over':
					checkbox.addClass('hover');
				break;
				case 'out':
					checkbox.removeClass('hover');
				break;
				case 'thin':
					checkbox.addClass('thin');
				break;
				case 'cancelthin':
					checkbox.removeClass('thin');
				break;
				case 'disable':
					checkbox.addClass('disable');
				break;
			}
		},
		sigle: function() {
			var $radio = this.getChecked();
			if($radio.length == 0) return;
			this.unchecked($radio[0]);
		}
	}

	var Ajax = {
		getData: function(success) {
			var $this = this,
				settings  = this.settings.ajax,
				key   = settings.params.primary || 'id',
				params = {};
			return function(parent, id) {
				id = id || settings.params[key];
				params[key] = id;
				$.extend(settings.params, params);
				$.ajax({
					url: settings.url,
					type: settings.type || 'get',
					dataType: settings.dataType || 'json',
					data: settings.params,
					beforeSend: function() {
						$this.loading('show', parent);
					},
					complete: function() {
						$this.loading('hide', parent);
					},
					success: function(data) {
						success(data, parent);
					},
					error: function() {
						Effects.fadeUp(parent.find('>.operate>.text').get(0),255,158,158); //ff9e9e
					}
				});
			}
		},
		loading: function(status, target) {
			var img = $('<img src="ui/spinner.gif" />'), hitarea;
				img
					.addClass('loadingIco')
					.css({'position': 'absolute', 'left': '13px', 'top': '4px'});
			hitarea = target[0] == this.rootree[0] ? target : target.find('>.operate');
			var ico = hitarea.find('>.ico');
			switch(status) {
				case 'show':
					hitarea.css('position','relative');
					img.appendTo(hitarea);
					if(ico[0]) ico.css('visibility','hidden');
				break;
				case 'hide':
					hitarea.css('position','static').find('.loadingIco').remove();
					if(ico[0])  ico.css('visibility','inherit');
				break;
			}
		}
	}

	var Effects = {
			fadeUp: function(element,red,green,blue) {
				  if (element.fade) {
				   clearTimeout(element.fade);
				  }
				  element.style.backgroundColor = "rgb("+red+","+green+","+blue+")";
				  if (red == 255 && green == 255 && blue == 255) {
				   return;
				  }
				  var newred = red + Math.ceil((255 - red)/10);
				  var newgreen = green + Math.ceil((255 - green)/10);
				  var newblue = blue + Math.ceil((255 - blue)/10);
				  var repeat = function() {
				   Effects.fadeUp(element,newred,newgreen,newblue)
				  };
				  element.fade = setTimeout(repeat, 100);
			}
	}

	

	$.each([CheckWidget.prototype, Ajax], function(step, OBJECT){
		$.extend(Tree.prototype, OBJECT);
	});

	$.Tree = Tree;

	$.fn.tree = function( options ) {
		return this.each(function() {
			var $this = $(this);
			var tree = new Tree($this, options||{});
			$this.data('tree', tree);
		});
	}
})(jQuery);
