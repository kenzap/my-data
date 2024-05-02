
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35735/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * @name getAPI
   * @description Returns API link from local storage. API can point to different datacenters.
   * @param {string} api
   */
  const getAPI = () => {

      return localStorage.getItem("API") ? localStorage.getItem("API") : "https://api-eu.kenzap.cloud";
  };

  /**
   * @name initHeader
   * @description Initiates Kenzap Cloud extension header and related scripts. Verifies user sessions, handles SSO, does cloud space navigation, initializes i18n localization. 
   * @param {object} response
   */
  const initHeader = (response) => {

      // cache header from backend
      if(response.header) localStorage.setItem('header', response.header);

      // cache CDN link
      if(response.cdn) localStorage.setItem('cdn', response.cdn);
    
      // load header to html if not present
      if(!document.querySelector("#k-script")){
    
          let child = document.createElement('div');
          child.innerHTML = localStorage.getItem('header');
          child = child.firstChild;
          document.body.prepend(child);
    
          // run header scripts
          Function(document.querySelector("#k-script").innerHTML).call('test');
      }
    
      // load locales if present
      if(response.locale) window.i18n.init(response.locale); 
  };

  /*
   * Translates string based on preloaded i18n locale values.
   * 
   * @param text {String} text to translate
   * @param cb {Function} callback function to escape text variable
   * @param p {String} list of parameters, to be replaced with %1$, %2$..
   * @returns {String} - text
   */
  const __esc = (text, cb, ...p) => {

      let match = (input, pa) => {

          pa.forEach((p, i) => { input = input.replace('%'+(i+1)+'$', p); }); 
          
          return input;
      };

      if(typeof window.i18n === 'undefined') return match(text, p);
      if(window.i18n.state.locale.values[text] === undefined) return match(text, p);

      return match(cb(window.i18n.state.locale.values[text]), p);
  };

  /*
   * Converts special characters `&`, `<`, `>`, `"`, `'` to HTML entities.
   * 
   * @param text {String}  text
   * @returns {String} - text
   */
  const html = (text) => {

      text = String(text);

      if(text.length === 0){
  		return '';
  	}

      return text.replace(/[&<>'"]/g, tag => (
          {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              "'": '&apos;',
              '"': '&quot;'
          } [tag]));
  };

  /*
   * Converts special characters `&`, `<`, `>`, `"`, `'` to HTML entities and does translations
   * 
   * @param text {String}  text
   * @returns {String} - text
   */
  const __html = (text, ...p) => {

      text = String(text);

      if(text.length === 0){
  		return '';
  	}

      let cb = (text) => {

          return text.replace(/[&<>'"]/g, tag => (
              {
                  '&': '&amp;',
                  '<': '&lt;',
                  '>': '&gt;',
                  "'": '&apos;',
                  '"': '&quot;'
              } [tag]));
      };

      return __esc(text, cb, ...p);
  };

  /**
   * @name showLoader
   * @description Initiates full screen three dots loader.
   */
  const showLoader = () => {

      let el = document.querySelector(".loader");
      if (el) el.style.display = 'block';
  };

  /**
   * @name hideLoader
   * @description Removes full screen three dots loader.
   */
  const hideLoader = () => {

      let el = document.querySelector(".loader");
      if (el) el.style.display = 'none';
  };

  /**
   * @name initFooter
   * @description Removes full screen three dots loader.
   * @param {string} left - Text or html code to be present on the left bottom side of screen
   * @param {string} right - Text or html code to be present on the left bottom side of screen
   */
  const initFooter = (left, right) => {

      document.querySelector("footer .row").innerHTML = `
    <div class="d-sm-flex justify-content-center justify-content-sm-between">
        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">${left}</span>
        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">${right}</span>
    </div>`;
  };

  /**
   * @name link
   * @description Handles Cloud navigation links between extensions and its pages. Takes care of custom url parameters.
   * @param {string} slug - Any inbound link
   * 
   * @returns {string} link - Returns original link with kenzp cloud space ID identifier.
   */
  const link = (slug) => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let sid = urlParams.get('sid') ? urlParams.get('sid') : "";

      let postfix = slug.indexOf('?') == -1 ? '?sid='+sid : '&sid='+sid;

      return slug + postfix;
  };

  /**
   * @name spaceID
   * @description Gets current Kenzap Cloud space ID identifier from the URL.
   * 
   * @returns {string} id - Kenzap Cloud space ID.
   */
   const spaceID = () => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get('sid') ? urlParams.get('sid') : "";

      return id;
  };

  /**
   * @name setCookie
   * @description Set cookie by its name to all .kenzap.cloud subdomains
   * @param {string} name - Cookie name.
   * @param {string} value - Cookie value.
   * @param {string} days - Number of days when cookie expires.
   */
   const setCookie = (name, value, days) => {

      let expires = "";
      if (days) {
          let date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = ";expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (escape(value) || "") + expires + ";path=/;domain=.kenzap.cloud"; 
  };

  /**
   * @name getCookie
   * @description Read cookie by its name.
   * @param {string} cname - Cookie name.
   * 
   * @returns {string} value - Cookie value.
   */
  const getCookie$1 = (cname) => {

      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  };

  /**
   * @name checkHeader
   * @description This function tracks UI updates, creates header version checksum and compares it after every page reload
   * @param {object} object - API response.
   */
   const checkHeader = () => {

      let version = (localStorage.hasOwnProperty('header') && localStorage.hasOwnProperty('header-version')) ? localStorage.getItem('header-version') : 0;
      let check = window.location.hostname + '/' + spaceID() + '/' + getCookie$1('locale');
      if(check != getCookie$1('check')){ version = 0; console.log('refresh'); }
      
      setCookie('check', check, 5);

      return version
  };

  /**
   * @name headers
   * @description Default headers object for all Kenzap Cloud fetch queries.
   * @param {object} headers
   */
   const H = () => {

      return {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookie$1('kenzap_api_key'),
          'Kenzap-Locale': getCookie$1('locale') ? getCookie$1('locale') : "en",
          'Kenzap-Header': checkHeader(),
          'Kenzap-Token': getCookie$1('kenzap_token'),
          'Kenzap-Sid': spaceID()
      }
  };

  /**
   * @name headers
   * @description Default headers object for all Kenzap Cloud fetch queries. 
   * @param {object} headers
   * @deprecated
   */
   ({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getCookie$1('kenzap_api_key'),
      'Kenzap-Locale': getCookie$1('locale') ? getCookie$1('locale') : "en",
      'Kenzap-Header': checkHeader(),
      'Kenzap-Token': getCookie$1('kenzap_token'),
      'Kenzap-Sid': spaceID(),
  });

  /**
   * @name parseApiError
   * @description Set default logics for different API Error responses.
   * @param {object} object - API response.
   */
   const parseApiError = (data) => {

      // outout to frontend console
      console.log(data);

      // unstructured failure
      if(isNaN(data.code)){
      
          // structure failure data
          let log = data;
          try{ log = JSON.stringify(log); }catch(e){ }

          let params = new URLSearchParams();
          params.append("cmd", "report");
          params.append("sid", spaceID());
          params.append("token", getCookie$1('kenzap_token'));
          params.append("data", log);
          
          // report error
          fetch('https://api-v1.kenzap.cloud/error/', { method: 'post', headers: { 'Accept': 'application/json', 'Content-type': 'application/x-www-form-urlencoded', }, body: params });

          alert('Can not connect to Kenzap Cloud');  
          return;
      }
      
      // handle cloud error codes
      switch(data.code){

          // unauthorized
          case 401:

              // dev mode
              if(window.location.href.indexOf('localhost')!=-1){ 

                  alert(data.reason); 
                  return; 
              }

              // production mode
              location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+encodeURIComponent(window.location.href); break;
          
          // something else
          default:

              alert(data.reason); 
              break;
      }
  };

  /**
   * @name initBreadcrumbs
   * @description Render ui breadcrumbs.
   * @param {array} data - List of link objects containing link text and url. If url is missing then renders breadcrumb as static text. Requires html holder with .bc class.
   */
  const initBreadcrumbs = (data) => {

      let html = '<ol class="breadcrumb mt-2 mb-0">';
      for(let bc of data){
          
          if(typeof(bc.link) === 'undefined'){

              html += `<li class="breadcrumb-item">${ bc.text }</li>`;
          }else {

              html += `<li class="breadcrumb-item"><a href="${ bc.link }">${ bc.text }</a></li>`;
          }
      }
      html += '</ol>';
      
      document.querySelector(".bc").innerHTML = html;
  };

  /**
   * @name onClick
   * @description One row click event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onClick = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('click', fn, true);
          e.addEventListener('click', fn, true);
      }
  };

  /**
   * @name onKeyUp
   * @description One row key up event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onKeyUp = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('keyup', fn, true);
          e.addEventListener('keyup', fn, true);
      }
  };

  /**
   * @name toast
   * @description Triggers toast notification. Adds toast html to the page if missing.
   * @param {string} text - Toast notification.
   */
   const toast = (text) => {

      // only add once
      if(!document.querySelector(".toast")){

          let html = `
        <div class="toast-cont position-fixed bottom-0 p-2 m-4 end-0 align-items-center" style="z-index:10000;">
            <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
                <div class="d-flex">
                    <div class="toast-body"></div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>`;
          if(document.querySelector('body > div')) document.querySelector('body > div').insertAdjacentHTML('afterend', html);
      }

      let toast = new bootstrap.Toast(document.querySelector('.toast'));
      document.querySelector('.toast .toast-body').innerHTML = text;  
      toast.show();
  };

  var getCookie = function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };
  var getPageNumber = function getPageNumber() {
    var urlParams = new URLSearchParams(window.location.search);
    var page = urlParams.get('page') ? urlParams.get('page') : 1;
    return parseInt(page);
  };

  var HTMLContent = function HTMLContent(__) {
    return "\n        <div class=\"container p-edit\">\n            <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n                <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n                <div class=\"d-none\">\n                    <a style=\"margin-right:16px;\" class=\"preview-link nounderline\" target=\"_blank\" href=\"#\">".concat(__('preview'), "<i class=\"mdi mdi-monitor\"></i></a>\n                    <button class=\"btn btn-primary btn-publish\" type=\"button\">").concat(__('Publish menu'), "</button>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div id=\"mydata-chart\"></div>\n            </div>\n        </div>\n\n        <div class=\"modal\" tabindex=\"-1\">\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <h5 class=\"modal-title\"></h5>\n                        <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n                    </div>\n                    <div class=\"modal-body p-0\">\n\n                    </div>\n                    <div class=\"modal-footer\">\n                        <button type=\"button\" class=\"btn btn-primary btn-modal\"></button>\n                        <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n    ");
  };

  var _this2 = undefined;
  var _this = {
    state: {
      firstLoad: true,
      html: '',
      data: {},
      ajaxQueue: 0,
      limit: 25,
      responseKey: [],
      modal: null,
      modalCont: null,
      editor: {}
    },
    init: function init() {
      _this.getData();
    },
    getData: function getData() {
      if (_this.state.firstLoad) showLoader();
      fetch(getAPI(), {
        method: 'post',
        headers: H(),
        body: JSON.stringify({
          query: {
            locale: {
              type: 'locale',
              id: getCookie('lang')
            },
            mydata: {
              type: 'mydata'
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        if (response.success) {
          initHeader(response);
          _this.loadHomeStructure();
          _this.renderPage(response);
          _this.initListeners();
          _this.initFooter();
          _this.state.firstLoad = false;
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    },
    getExtensions: function getExtensions() {
      var params = new URLSearchParams();
      params.append("cmd", "preview_extensions");
      params.append("s", '');
      params.append("token", getCookie('kenzap_token'));
      fetch('https://siteapi.kenzap.cloud/v1/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        body: params
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        if (response.success) ;
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    },
    renderPage: function renderPage(response) {
      initBreadcrumbs([{
        link: link('https://dashboard.kenzap.cloud?launcher=mydata'),
        text: __('Dashboard')
      }, {
        text: __('My Data')
      }]);
      am4core.useTheme(am4themes_animated);
      var chart = am4core.create("mydata-chart", am4plugins_forceDirected.ForceDirectedTree);
      var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
      var myData = [];
      var parentNodes = {};
      response.mydata.data.forEach(function (el, i) {
        var key_parts = el.key.split('-');
        if (key_parts.length > 1) {
          var key_start = key_parts[0];
          if (!parentNodes[key_start]) {
            parentNodes[key_start] = el.count;
          } else {
            parentNodes[key_start] += el.count;
          }
        } else {
          if (!parentNodes[el.key]) {
            parentNodes[el.key] = el.count;
          } else {
            parentNodes[el.key] += el.count;
          }
        }
      });
      Object.entries(parentNodes).forEach(function (el, i) {
        var key_parts = el[0].split('-');
        var key_start = key_parts[0];
        var children = [];
        response.mydata.data.forEach(function (elc, i) {
          if (elc.key.startsWith(key_start + '-')) {
            children.push({
              name: elc.key + ' ' + elc.count,
              value: 5
            });
          }
        });
        children.push({
          name: el[0] + ' ' + el[1],
          value: 5
        });
        myData.push({
          name: el[0],
          value: 8,
          children: children
        });
      });
      networkSeries.data = myData;
      networkSeries.dataFields.linkWith = "linkWith";
      networkSeries.dataFields.category = "category";
      networkSeries.dataFields.name = "name";
      networkSeries.dataFields.id = "name";
      networkSeries.dataFields.value = "value";
      networkSeries.dataFields.children = "children";
      networkSeries.dataFields.fixed = "fixed";
      networkSeries.nodes.template.propertyFields.x = "x";
      networkSeries.nodes.template.propertyFields.y = "y";
      networkSeries.nodes.template.tooltipText = "{name}";
      networkSeries.nodes.template.fillOpacity = 1;
      networkSeries.nodes.template.label.text = "{name}";
      networkSeries.fontSize = 8;
      networkSeries.maxLevels = 3;
      networkSeries.nodes.template.label.hideOversized = true;
      networkSeries.nodes.template.label.truncate = true;
      networkSeries.nodes.template.draggable = true;
      networkSeries.nodePadding = 10;
      networkSeries.nodes.template.events.on("hit", function (ev) {
        var circle = ev.target.label.currentText.split(" ");
        _this.state.modalCont = null;
        if (circle.length > 1) _this.getKeyData(circle[0]);
      }, _this2);
      hideLoader();
    },
    getKeyData: function getKeyData(key) {
      var s = document.querySelector('.input-search') ? document.querySelector('.input-search').value : "";
      fetch(getAPI(), {
        method: 'post',
        headers: H(),
        body: JSON.stringify({
          query: {
            data: {
              type: 'find',
              key: key,
              fields: '*',
              search: {
                s: s
              },
              sortby: {
                field: 'updated',
                order: 'DESC'
              },
              offset: s.length > 0 ? 0 : getPageNumber() * _this.state.limit - _this.state.limit,
              limit: _this.state.limit
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        if (response.success) {
          _this.state.responseKey = response;
          _this.viewDataSets(key, response);
        }
      })["catch"](function (error) {
        parseApiError(error);
      });
    },
    initListeners: function initListeners() {
      if (!_this.state.firstLoad) return;
      onClick('.btn-publish', _this.listeners.publish);
      onClick('.domain-list li a', _this.listeners.domainChange);
      onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {
      modalSuccessBtn: function modalSuccessBtn(e) {
        _this.listeners.modalSuccessBtnFunc(e);
      },
      modalSuccessBtnFunc: null
    },
    viewDataSets: function viewDataSets(key, response) {
      _this.state.key = key;
      if (!_this.state.modalCont || !_this.state.modal) {
        _this.state.modal = document.querySelector(".modal");
        _this.state.modalCont = new bootstrap.Modal(_this.state.modal);
        history.pushState({
          pageID: 'Data'
        }, 'Data', window.location.pathname + window.location.search + "#editing");
        _this.state.modal.querySelector(".modal-dialog").classList.add('modal-fullscreen');
        _this.state.modal.querySelector(".modal-header .modal-title").innerHTML = "\n            <div class=\"d-flex align-items-center\">\n                <input type=\"text\" style=\"width:320px;\" placeholder=\"".concat(__html('Search in %1$', key), "\" class=\"form-control fs-6 border-top-0 border-start-0 input-search border-end-0 rounded-0 ms-2\" aria-label=\"").concat(__html('Search'), "\" aria-describedby=\"inputGroup-sizing-sm\" >\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"currentColor\" class=\"ms-2 bi bi-list po restart-table d-none\" viewBox=\"0 0 16 16\">\n                    <path fill-rule=\"evenodd\" d=\"M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z\"/>\n                </svg>\n            </div>\n            ");
        _this.state.modal.querySelector('.modal-footer').innerHTML = "\n                <button type=\"button\" class=\"btn btn-primary btn-modal btn-update-record d-none\">".concat(__html('Update'), "</button>\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">").concat(__html('Close'), "</button>\n            ");
        onKeyUp('.input-search', function (e) {
          e.preventDefault();
          if (_this.state.timeout) clearTimeout(_this.state.timeout);
          _this.state.timeout = setTimeout(function (_this) {
            _this.getKeyData(key);
          }, 600, _this);
        });
        _this.state.modal.querySelector('.restart-table').addEventListener('click', function (e) {
          _this.state.modal.querySelector('.restart-table').classList.add('d-none');
          _this.state.modal.querySelector('.btn-update-record').classList.add('d-none');
          _this.getKeyData(key);
        });
        _this.state.modal.querySelector('.btn-update-record').addEventListener('click', function (e) {
          fetch(getAPI(), {
            method: 'post',
            headers: H(),
            body: JSON.stringify({
              query: {
                record: {
                  type: 'update',
                  key: _this.state.key,
                  id: _this.state._id,
                  data: JSON.parse(_this.state.editor['json'].getValue())
                }
              }
            })
          }).then(function (response) {
            return response.json();
          }).then(function (response) {
            if (response.success) {
              toast(__html('Record updated'));
              _this.state.modal.querySelector('.restart-table').classList.add('d-none');
              _this.state.modal.querySelector('.btn-update-record').classList.add('d-none');
              _this.getKeyData(key);
            } else {
              parseApiError(response);
            }
          })["catch"](function (error) {
            parseApiError(error);
          });
        });
      }
      _this.state.modal.querySelector(".modal-body").innerHTML = "\n            <div class=\"row\">\n                <div class=\"col-sm-12\">\n                    <div id=\"editor\" class=\"editor d-none\" style=\"min-height:2000px;\">\n\n\n                    </div>\n                    <div class=\"table-responsive\">\n                        <table class=\"table table-hover table-borderless align-middle table-striped table-p-list\">\n                            <thead>\n                                <tr>\n                                    <th id=\"table-id-header\">".concat(__html("_id"), "</th>\n                                    <th>").concat(__html("data"), "</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                            ").concat(response.data.length == 0 ? "<tr><td colspan=\"2\" class=\"text-muted\">".concat(__html('no data to display'), "</td>") : "", "\n\n                            ").concat(response.data.map(function (obj, i) {
        return "\n                                    <tr>\n                                        <td id=\"table-id".concat(i, "\" class=\"table-obj table-id font-monospace\">").concat(obj._id, "</td>\n                                        <td id=\"table-obj").concat(i, "\" data-id=\"").concat(obj._id, "\" class=\"elipsized table-data font-monospace table-obj\" style=\"\">").concat(html(JSON.stringify(obj)), "</td>\n                                    </tr>\n                                    ");
      }).join(''), "\n                            </tbody>\n                        </table>\n                    </div>\n                </div>\n            </div>\n        ");
      _this.state.modalCont.show();
      _toConsumableArray(document.querySelectorAll('.table-data')).forEach(function (row, i) {
        row.addEventListener('click', function (e) {
          e.preventDefault();
          var obj = _this.state.responseKey.data.filter(function (el) {
            return el._id == e.currentTarget.dataset.id;
          })[0];
          document.querySelector('.restart-table').classList.remove('d-none');
          document.querySelector('#editor').classList.remove('d-none');
          document.querySelector('.table-p-list').classList.add('d-none');
          document.querySelector('.btn-update-record').classList.remove('d-none');
          _this.state._id = e.currentTarget.dataset.id;
          _this.state.editor['json'] = ace.edit("editor");
          ace.config.set('basePath', 'https://account.kenzap.com/js/ace/');
          _this.state.editor['json'].getSession().setMode("ace/mode/json");
          _this.state.editor['json'].setValue(JSON.stringify(obj, null, 2), -1);
        });
      });
      if (!_this.state.modalCont || !_this.state.modal) ;
    },
    loadHomeStructure: function loadHomeStructure() {
      if (!_this.state.firstLoad) return;
      document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    initFooter: function initFooter$1() {
      initFooter(__('My Data 1.0.1 by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/my-data" target="_blank">', '</a>'), '');
    }
  };
  _this.init();

})();
//# sourceMappingURL=index.js.map
