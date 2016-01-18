var Snoopy = (function() {
	function Snoopy(obj) {
		this.snoopers = {};
		Object.keys(obj).forEach(function(key) {
			this[key] = obj[key];
		}, this);
	}

	Snoopy.prototype.changed = function(prop) {
		var newVal = this[prop];
		(this.snoopers[prop] || []).forEach(function(snooper) {
			snooper(newVal);
		});
	};

	Snoopy.prototype.get = function(prop) {
		return this[prop];
	};

	Snoopy.prototype.set = function(prop, val) {
		this[prop] = val;
		this.changed(prop);
	};

	Snoopy.prototype.snoop = function(props, snooper) {
		if (snooper) {
			var propsArr = props.split(' ');
			
			// caller calls snooper with the values of the passed props
			var propToVal = this.get.bind(this);
			var caller = function caller() {
				snooper.apply(null, propsArr.map(propToVal));
			};
			
			caller();
			
			// push caller to snooper list
			var t = this;
			propsArr.forEach(function(prop) {
				if (!t.snoopers[prop]) t.snoopers[prop] = [];
				t.snoopers[prop].push(caller);
			});
		} else {
			// snoopable
			return this.snoop.bind(this, props);
		}
	};

	return Snoopy;
})();