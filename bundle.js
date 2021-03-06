'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// Prototype. Needs refactoring before moving to a production server.
// ==========================================================================
(function (win, doc, $) {
	'use strict';

	// Log

	var log = function log() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		console.log(args);
	};

	log("hello theadsfads");

	var views = doc.querySelectorAll('.fluid-container');

	// Class - Form controls

	var FormControls = function () {
		function FormControls(args, cb) {
			_classCallCheck(this, FormControls);

			this.el = args.el;
			this.value = this.el.value ? this.el.value : '';
			this.onevent = args.onevent;
			this.valueLength = args.valueLength;
			this.validClass = args.validClass;
			this.type = args.type;
			this.isValid = false;

			var callback = typeof cb === 'function' ? cb : null;
			this.loggingin(callback);
		}

		_createClass(FormControls, [{
			key: 'loggingin',
			value: function loggingin(callback) {
				var root = this;
				this.el.addEventListener(this.onevent, function (e) {
					if (this.type === "email") {

						var pattern = new RegExp(root.el.pattern);

						if (pattern.test(this.value)) {
							this.classList.add(root.validClass);
							root.isValid = true;
							callback(this, root.isValid);
							console.log(root.isValid);
						} else {
							this.classList.remove(root.validClass);
							root.isValid = false;
						}
					} else {
						if (this.value.length >= root.valueLength) {
							this.classList.add(root.validClass);
							root.isValid = true;
							callback(this, root.isValid);
						} else {
							this.classList.remove(root.validClass);
							root.isValid = false;
						}
					}
				});
			} //loggingin()

		}], [{
			key: 'cachedLogin',
			value: function cachedLogin(key, loginEl, loginObj, passwordEl) {
				if (localStorage.getItem(key)) {
					loginEl.value = localStorage.getItem(key);
					passwordEl.focus();

					loginObj.isValid = true;
					loginObj.el.classList.add(loginObj.validClass);

					console.log('Static method to the rescue');
				} else {
					loginObj.isValid = false;
					loginObj.el.classList.remove(loginObj.validClass);
				}
			}
		}]);

		return FormControls;
	}();

	// Login


	var login = new FormControls({
		el: doc.querySelector('[type=email]'),
		onevent: 'input',
		validClass: 'yup',
		type: 'email'
	}, function (el, obj, isValid) {
		localStorage.setItem('login', el.value);
	});

	// Check for cached login via localStorage
	FormControls.cachedLogin("login", doc.querySelector('[type=email]'), login, doc.querySelector('[type=password]'));

	// Password
	var password = new FormControls({
		el: doc.querySelector('[type=password]'),
		onevent: 'input',
		valueLength: '5',
		validClass: 'yup',
		type: 'password'
	}, function (me, isValid) {
		if (login.isValid && isValid) {
			doc.querySelector('[type=submit]').removeAttribute('disabled');
		}
	});

	// Form submission
	var signin = doc.getElementById('signin-form');
	signin.addEventListener('submit', function submitHandler(event) {
		event.preventDefault();

		// Quick and dirty
		views[1].classList.remove('hidden');
	});

	// Fetch
	var dataURL = 'https://gist.githubusercontent.com/jonscottclark/28435d08a1a3cb09b6244daefe6a12a1/raw/be545452376a08c0e2b38cee9f3a444bb4ba555a/sochi2014.json',
	    data = '';

	var countryList = [];
	var countryData = [];
	var favouriteCountries = [];
	var countryLinks = '';
	var foobale = "";

	// Test VARS
	var countryCount = doc.getElementById('country-count');
	countryCount.innerHTML = 'loading';

	$.get(dataURL, function (response) {
		data = JSON.parse(response);
		//console.log(data);

		// Participating Countries
		countryCount.innerHTML = data.length;

		// New array with key value pairs for name and medals only
		countryData = data.map(function (country) {
			return {
				abbr: country.abbr,
				name: country.name,
				medals: country.medals,
				totalMedal: 0,
				flag: country.flag
			};
		});

		listCountriesWithMedals(countryData, $('#countries-list'));
	});

	// TODO: Refactor to be more generic.
	//       Use to also list favourite countries
	function listCountriesWithMedals(countries, wrapper) {
		var list = '';
		countries.forEach(function (country, index, arr) {

			// Total Medal per
			var medals = 0;
			for (var key in country.medals) {
				medals += country.medals[key];
			}

			if (medals > 0) {
				country.totalMedal = medals;

				// A poor mans 'Virtual-DOM'
				list += '\n\t\t    \t<a href="/#' + country.abbr + '" class="list-group-item" role="button">\n\t\t    \t\t' + country.name + '\n\t\t    \t</a>\n\t    \t';
			}

			if (index == arr.length - 1) {
				wrapper.html(list);
			}
		});
	}

	// Favourite selection
	var favCount = doc.getElementById('favourite-count');
	doc.getElementById('countries-list').addEventListener('click', function (e) {
		e.preventDefault();
		if (e.currentTarget !== e.target) {

			var abbr = e.target.hash.replace('#', '');
			console.log(abbr);

			var c = _.find(countryData, function (c) {
				return c.abbr == abbr;
			});

			if (favouriteCountries.indexOf(c) == -1) {
				// If the item does not exist in favouriteCountries[] then add to array
				favouriteCountries.push(c);
				favouriteCountries = _.orderBy(favouriteCountries, ['totalMedal', 'medals.gold'], ['desc', 'desc']);

				// Add dsiabled class
				e.target.classList.add('list-group-item-success');
				favCount.innerHTML = favouriteCountries.length;
			} else {
				// Remove item
				favouriteCountries.splice(favouriteCountries.indexOf(c), 1);
				favouriteCountries = _.orderBy(favouriteCountries, ['totalMedal', 'medals.gold'], ['desc', 'desc']);

				console.log(favouriteCountries);
				e.target.classList.remove('list-group-item-success');
				favCount.innerHTML = favouriteCountries.length;
			}
		}
	});

	var favCountriesList = doc.getElementById('favourite-countries');

	favCountriesList.addEventListener('click', function (e) {
		doc.getElementById('view-stats').classList.add('hidden');

		doc.getElementById('view-favourite-countries-with-medals').classList.remove('visually-hidden');

		// NOTE: Not DRY. Refactor listCountriesWithMedals()
		var list = '';

		if (favouriteCountries.length >= 1) {
			favouriteCountries.forEach(function (country, index, arr) {
				var medals = 0;
				for (var key in country.medals) {
					medals += country.medals[key];
				}

				list += '\n\t\t  \t<li href="' + country.abbr + '" class="list-group-item" role="button">\n\t\t  \t\t<span class="badge">' + medals + '</span>\n\t\t  \t\t' + country.name + '\n\t\t  \t\t<hr>\n\t\t  \t\t<ul class="heavy-metals">\n\t\t  \t\t\t<li><b>' + country.medals.gold + '</b> Gold</li>\n\t\t  \t\t\t<li><b>' + country.medals.silver + '</b> Silver</li>\n\t\t  \t\t\t<li><b>' + country.medals.bronze + '</b> Bronze</li>\n\t\t  \t\t</ul>\n\t\t  \t</li>\n\t\t  \t';

				if (index == arr.length - 1) {
					$('#view-favourite-countries-with-medals .list-group').html(list);
				}
			});
		} else {
			$('#view-favourite-countries-with-medals .list-group').html('');
		}

		// listCountriesWithMedals(favouriteCountries, $('#view-favourite-countries-with-medals'));
	});

	// Back
	$('.back-btn').click(function (e) {
		$(this).parent().addClass('visually-hidden');
		doc.getElementById('view-stats').classList.remove('hidden');
		return false;
	});
})(window, document, jQuery);
//# sourceMappingURL=bundle.js.map
