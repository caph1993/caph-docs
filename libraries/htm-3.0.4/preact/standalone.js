"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = a;
exports.render = T;
exports.Component = d;
exports.createContext = U;
exports.useState = q;
exports.useReducer = B;
exports.useEffect = $;
exports.useLayoutEffect = j;
exports.useRef = z;
exports.useImperativeHandle = G;
exports.useMemo = J;
exports.useCallback = K;
exports.useContext = Q;
exports.useDebugValue = X;
exports.html = void 0;

var e,
    n,
    t,
    _,
    o,
    r,
    u,
    l = {},
    i = [],
    c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

function s(e, n) {
  for (var t in n) {
    e[t] = n[t];
  }

  return e;
}

function f(e) {
  var n = e.parentNode;
  n && n.removeChild(e);
}

function a(e, n, t) {
  var _,
      o = arguments,
      r = {};

  for (_ in n) {
    "key" !== _ && "ref" !== _ && (r[_] = n[_]);
  }

  if (arguments.length > 3) for (t = [t], _ = 3; _ < arguments.length; _++) {
    t.push(o[_]);
  }
  if (null != t && (r.children = t), "function" == typeof e && null != e.defaultProps) for (_ in e.defaultProps) {
    void 0 === r[_] && (r[_] = e.defaultProps[_]);
  }
  return p(e, r, n && n.key, n && n.ref, null);
}

function p(n, t, _, o, r) {
  var u = {
    type: n,
    props: t,
    key: _,
    ref: o,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    constructor: void 0,
    __v: r
  };
  return null == r && (u.__v = u), e.vnode && e.vnode(u), u;
}

function h(e) {
  return e.children;
}

function d(e, n) {
  this.props = e, this.context = n;
}

function v(e, n) {
  if (null == n) return e.__ ? v(e.__, e.__.__k.indexOf(e) + 1) : null;

  for (var t; n < e.__k.length; n++) {
    if (null != (t = e.__k[n]) && null != t.__e) return t.__e;
  }

  return "function" == typeof e.type ? v(e) : null;
}

function m(e) {
  var n, t;

  if (null != (e = e.__) && null != e.__c) {
    for (e.__e = e.__c.base = null, n = 0; n < e.__k.length; n++) {
      if (null != (t = e.__k[n]) && null != t.__e) {
        e.__e = e.__c.base = t.__e;
        break;
      }
    }

    return m(e);
  }
}

function y(r) {
  (!r.__d && (r.__d = !0) && n.push(r) && !t++ || o !== e.debounceRendering) && ((o = e.debounceRendering) || _)(g);
}

function g() {
  for (var e; t = n.length;) {
    e = n.sort(function (e, n) {
      return e.__v.__b - n.__v.__b;
    }), n = [], e.some(function (e) {
      var n, t, _, o, r, u, l;

      e.__d && (u = (r = (n = e).__v).__e, (l = n.__P) && (t = [], (_ = s({}, r)).__v = _, o = H(l, r, _, n.__n, void 0 !== l.ownerSVGElement, null, t, null == u ? v(r) : u), S(t, r), o != u && m(r)));
    });
  }
}

function k(e, n, t, _, o, r, u, c, s) {
  var a,
      p,
      h,
      d,
      m,
      y,
      g,
      k = t && t.__k || i,
      x = k.length;
  if (c == l && (c = null != r ? r[0] : x ? v(t, 0) : null), a = 0, n.__k = b(n.__k, function (t) {
    if (null != t) {
      if (t.__ = n, t.__b = n.__b + 1, null === (h = k[a]) || h && t.key == h.key && t.type === h.type) k[a] = void 0;else for (p = 0; p < x; p++) {
        if ((h = k[p]) && t.key == h.key && t.type === h.type) {
          k[p] = void 0;
          break;
        }

        h = null;
      }

      if (d = H(e, t, h = h || l, _, o, r, u, c, s), (p = t.ref) && h.ref != p && (g || (g = []), h.ref && g.push(h.ref, null, t), g.push(p, t.__c || d, t)), null != d) {
        var i;
        if (null == y && (y = d), void 0 !== t.__d) i = t.__d, t.__d = void 0;else if (r == h || d != c || null == d.parentNode) {
          e: if (null == c || c.parentNode !== e) e.appendChild(d), i = null;else {
            for (m = c, p = 0; (m = m.nextSibling) && p < x; p += 2) {
              if (m == d) break e;
            }

            e.insertBefore(d, c), i = c;
          }

          "option" == n.type && (e.value = "");
        }
        c = void 0 !== i ? i : d.nextSibling, "function" == typeof n.type && (n.__d = c);
      } else c && h.__e == c && c.parentNode != e && (c = v(h));
    }

    return a++, t;
  }), n.__e = y, null != r && "function" != typeof n.type) for (a = r.length; a--;) {
    null != r[a] && f(r[a]);
  }

  for (a = x; a--;) {
    null != k[a] && D(k[a], k[a]);
  }

  if (g) for (a = 0; a < g.length; a++) {
    P(g[a], g[++a], g[++a]);
  }
}

function b(e, n, t) {
  if (null == t && (t = []), null == e || "boolean" == typeof e) n && t.push(n(null));else if (Array.isArray(e)) for (var _ = 0; _ < e.length; _++) {
    b(e[_], n, t);
  } else t.push(n ? n("string" == typeof e || "number" == typeof e ? p(null, e, null, null, e) : null != e.__e || null != e.__c ? p(e.type, e.props, e.key, null, e.__v) : e) : e);
  return t;
}

function x(e, n, t) {
  "-" === n[0] ? e.setProperty(n, t) : e[n] = "number" == typeof t && !1 === c.test(n) ? t + "px" : null == t ? "" : t;
}

function w(e, n, t, _, o) {
  var r, u, l, i, c;
  if (o ? "className" === n && (n = "class") : "class" === n && (n = "className"), "style" === n) {
    if (r = e.style, "string" == typeof t) r.cssText = t;else {
      if ("string" == typeof _ && (r.cssText = "", _ = null), _) for (i in _) {
        t && i in t || x(r, i, "");
      }
      if (t) for (c in t) {
        _ && t[c] === _[c] || x(r, c, t[c]);
      }
    }
  } else "o" === n[0] && "n" === n[1] ? (u = n !== (n = n.replace(/Capture$/, "")), l = n.toLowerCase(), n = (l in e ? l : n).slice(2), t ? (_ || e.addEventListener(n, C, u), (e.l || (e.l = {}))[n] = t) : e.removeEventListener(n, C, u)) : "list" !== n && "tagName" !== n && "form" !== n && "type" !== n && "size" !== n && !o && n in e ? e[n] = null == t ? "" : t : "function" != typeof t && "dangerouslySetInnerHTML" !== n && (n !== (n = n.replace(/^xlink:?/, "")) ? null == t || !1 === t ? e.removeAttributeNS("http://www.w3.org/1999/xlink", n.toLowerCase()) : e.setAttributeNS("http://www.w3.org/1999/xlink", n.toLowerCase(), t) : null == t || !1 === t && !/^ar/.test(n) ? e.removeAttribute(n) : e.setAttribute(n, t));
}

function C(n) {
  this.l[n.type](e.event ? e.event(n) : n);
}

function H(n, t, _, o, r, u, l, i, c) {
  var f,
      a,
      p,
      v,
      m,
      y,
      g,
      b,
      x,
      w,
      C = t.type;
  if (void 0 !== t.constructor) return null;
  (f = e.__b) && f(t);

  try {
    e: if ("function" == typeof C) {
      if (b = t.props, x = (f = C.contextType) && o[f.__c], w = f ? x ? x.props.value : f.__ : o, _.__c ? g = (a = t.__c = _.__c).__ = a.__E : ("prototype" in C && C.prototype.render ? t.__c = a = new C(b, w) : (t.__c = a = new d(b, w), a.constructor = C, a.render = N), x && x.sub(a), a.props = b, a.state || (a.state = {}), a.context = w, a.__n = o, p = a.__d = !0, a.__h = []), null == a.__s && (a.__s = a.state), null != C.getDerivedStateFromProps && (a.__s == a.state && (a.__s = s({}, a.__s)), s(a.__s, C.getDerivedStateFromProps(b, a.__s))), v = a.props, m = a.state, p) null == C.getDerivedStateFromProps && null != a.componentWillMount && a.componentWillMount(), null != a.componentDidMount && a.__h.push(a.componentDidMount);else {
        if (null == C.getDerivedStateFromProps && b !== v && null != a.componentWillReceiveProps && a.componentWillReceiveProps(b, w), !a.__e && null != a.shouldComponentUpdate && !1 === a.shouldComponentUpdate(b, a.__s, w) || t.__v === _.__v && !a.__) {
          for (a.props = b, a.state = a.__s, t.__v !== _.__v && (a.__d = !1), a.__v = t, t.__e = _.__e, t.__k = _.__k, a.__h.length && l.push(a), f = 0; f < t.__k.length; f++) {
            t.__k[f] && (t.__k[f].__ = t);
          }

          break e;
        }

        null != a.componentWillUpdate && a.componentWillUpdate(b, a.__s, w), null != a.componentDidUpdate && a.__h.push(function () {
          a.componentDidUpdate(v, m, y);
        });
      }
      a.context = w, a.props = b, a.state = a.__s, (f = e.__r) && f(t), a.__d = !1, a.__v = t, a.__P = n, f = a.render(a.props, a.state, a.context), t.__k = null != f && f.type == h && null == f.key ? f.props.children : Array.isArray(f) ? f : [f], null != a.getChildContext && (o = s(s({}, o), a.getChildContext())), p || null == a.getSnapshotBeforeUpdate || (y = a.getSnapshotBeforeUpdate(v, m)), k(n, t, _, o, r, u, l, i, c), a.base = t.__e, a.__h.length && l.push(a), g && (a.__E = a.__ = null), a.__e = !1;
    } else null == u && t.__v === _.__v ? (t.__k = _.__k, t.__e = _.__e) : t.__e = E(_.__e, t, _, o, r, u, l, c);

    (f = e.diffed) && f(t);
  } catch (n) {
    t.__v = null, e.__e(n, t, _);
  }

  return t.__e;
}

function S(n, t) {
  e.__c && e.__c(t, n), n.some(function (t) {
    try {
      n = t.__h, t.__h = [], n.some(function (e) {
        e.call(t);
      });
    } catch (n) {
      e.__e(n, t.__v);
    }
  });
}

function E(e, n, t, _, o, r, u, c) {
  var s,
      f,
      a,
      p,
      h,
      d = t.props,
      v = n.props;
  if (o = "svg" === n.type || o, null != r) for (s = 0; s < r.length; s++) {
    if (null != (f = r[s]) && ((null === n.type ? 3 === f.nodeType : f.localName === n.type) || e == f)) {
      e = f, r[s] = null;
      break;
    }
  }

  if (null == e) {
    if (null === n.type) return document.createTextNode(v);
    e = o ? document.createElementNS("http://www.w3.org/2000/svg", n.type) : document.createElement(n.type, v.is && {
      is: v.is
    }), r = null, c = !1;
  }

  if (null === n.type) d !== v && e.data != v && (e.data = v);else {
    if (null != r && (r = i.slice.call(e.childNodes)), a = (d = t.props || l).dangerouslySetInnerHTML, p = v.dangerouslySetInnerHTML, !c) {
      if (d === l) for (d = {}, h = 0; h < e.attributes.length; h++) {
        d[e.attributes[h].name] = e.attributes[h].value;
      }
      (p || a) && (p && a && p.__html == a.__html || (e.innerHTML = p && p.__html || ""));
    }

    (function (e, n, t, _, o) {
      var r;

      for (r in t) {
        "children" === r || "key" === r || r in n || w(e, r, null, t[r], _);
      }

      for (r in n) {
        o && "function" != typeof n[r] || "children" === r || "key" === r || "value" === r || "checked" === r || t[r] === n[r] || w(e, r, n[r], t[r], _);
      }
    })(e, v, d, o, c), n.__k = n.props.children, p || k(e, n, t, _, "foreignObject" !== n.type && o, r, u, l, c), c || ("value" in v && void 0 !== v.value && v.value !== e.value && (e.value = null == v.value ? "" : v.value), "checked" in v && void 0 !== v.checked && v.checked !== e.checked && (e.checked = v.checked));
  }
  return e;
}

function P(n, t, _) {
  try {
    "function" == typeof n ? n(t) : n.current = t;
  } catch (n) {
    e.__e(n, _);
  }
}

function D(n, t, _) {
  var o, r, u;

  if (e.unmount && e.unmount(n), (o = n.ref) && (o.current && o.current !== n.__e || P(o, null, t)), _ || "function" == typeof n.type || (_ = null != (r = n.__e)), n.__e = n.__d = void 0, null != (o = n.__c)) {
    if (o.componentWillUnmount) try {
      o.componentWillUnmount();
    } catch (n) {
      e.__e(n, t);
    }
    o.base = o.__P = null;
  }

  if (o = n.__k) for (u = 0; u < o.length; u++) {
    o[u] && D(o[u], t, _);
  }
  null != r && f(r);
}

function N(e, n, t) {
  return this.constructor(e, t);
}

function T(n, t, _) {
  var o, u, c;
  e.__ && e.__(n, t), u = (o = _ === r) ? null : _ && _.__k || t.__k, n = a(h, null, [n]), c = [], H(t, (o ? t : _ || t).__k = n, u || l, l, void 0 !== t.ownerSVGElement, _ && !o ? [_] : u ? null : i.slice.call(t.childNodes), c, _ || l, o), S(c, n);
}

function U(e) {
  var n = {},
      t = {
    __c: "__cC" + u++,
    __: e,
    Consumer: function Consumer(e, n) {
      return e.children(n);
    },
    Provider: function Provider(e) {
      var _,
          o = this;

      return this.getChildContext || (_ = [], this.getChildContext = function () {
        return n[t.__c] = o, n;
      }, this.shouldComponentUpdate = function (e) {
        o.props.value !== e.value && _.some(function (n) {
          n.context = e.value, y(n);
        });
      }, this.sub = function (e) {
        _.push(e);

        var n = e.componentWillUnmount;

        e.componentWillUnmount = function () {
          _.splice(_.indexOf(e), 1), n && n.call(e);
        };
      }), e.children;
    }
  };
  return t.Consumer.contextType = t, t;
}

e = {
  __e: function __e(e, n) {
    for (var t, _; n = n.__;) {
      if ((t = n.__c) && !t.__) try {
        if (t.constructor && null != t.constructor.getDerivedStateFromError && (_ = !0, t.setState(t.constructor.getDerivedStateFromError(e))), null != t.componentDidCatch && (_ = !0, t.componentDidCatch(e)), _) return y(t.__E = t);
      } catch (n) {
        e = n;
      }
    }

    throw e;
  }
}, d.prototype.setState = function (e, n) {
  var t;
  t = this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof e && (e = e(t, this.props)), e && s(t, e), null != e && this.__v && (n && this.__h.push(n), y(this));
}, d.prototype.forceUpdate = function (e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), y(this));
}, d.prototype.render = h, n = [], t = 0, _ = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, r = l, u = 0;
var A,
    M,
    F,
    L = [],
    W = e.__r,
    R = e.diffed,
    V = e.__c,
    I = e.unmount;

function O(n) {
  e.__h && e.__h(M);
  var t = M.__H || (M.__H = {
    __: [],
    __h: []
  });
  return n >= t.__.length && t.__.push({}), t.__[n];
}

function q(e) {
  return B(te, e);
}

function B(e, n, t) {
  var _ = O(A++);

  return _.__c || (_.__c = M, _.__ = [t ? t(n) : te(void 0, n), function (n) {
    var t = e(_.__[0], n);
    _.__[0] !== t && (_.__[0] = t, _.__c.setState({}));
  }]), _.__;
}

function $(e, n) {
  var t = O(A++);
  ne(t.__H, n) && (t.__ = e, t.__H = n, M.__H.__h.push(t));
}

function j(e, n) {
  var t = O(A++);
  ne(t.__H, n) && (t.__ = e, t.__H = n, M.__h.push(t));
}

function z(e) {
  return J(function () {
    return {
      current: e
    };
  }, []);
}

function G(e, n, t) {
  j(function () {
    "function" == typeof e ? e(n()) : e && (e.current = n());
  }, null == t ? t : t.concat(e));
}

function J(e, n) {
  var t = O(A++);
  return ne(t.__H, n) ? (t.__H = n, t.__h = e, t.__ = e()) : t.__;
}

function K(e, n) {
  return J(function () {
    return e;
  }, n);
}

function Q(e) {
  var n = M.context[e.__c];
  if (!n) return e.__;
  var t = O(A++);
  return null == t.__ && (t.__ = !0, n.sub(M)), n.props.value;
}

function X(n, t) {
  e.useDebugValue && e.useDebugValue(t ? t(n) : n);
}

function Y() {
  L.some(function (n) {
    if (n.__P) try {
      n.__H.__h.forEach(Z), n.__H.__h.forEach(ee), n.__H.__h = [];
    } catch (t) {
      return n.__H.__h = [], e.__e(t, n.__v), !0;
    }
  }), L = [];
}

function Z(e) {
  e.t && e.t();
}

function ee(e) {
  var n = e.__();

  "function" == typeof n && (e.t = n);
}

function ne(e, n) {
  return !e || n.some(function (n, t) {
    return n !== e[t];
  });
}

function te(e, n) {
  return "function" == typeof n ? n(e) : n;
}

e.__r = function (e) {
  W && W(e), A = 0, (M = e.__c).__H && (M.__H.__h.forEach(Z), M.__H.__h.forEach(ee), M.__H.__h = []);
}, e.diffed = function (n) {
  R && R(n);
  var t = n.__c;

  if (t) {
    var _ = t.__H;
    _ && _.__h.length && (1 !== L.push(t) && F === e.requestAnimationFrame || ((F = e.requestAnimationFrame) || function (e) {
      var n,
          t = function t() {
        clearTimeout(_), cancelAnimationFrame(n), setTimeout(e);
      },
          _ = setTimeout(t, 100);

      "undefined" != typeof window && (n = requestAnimationFrame(t));
    })(Y));
  }
}, e.__c = function (n, t) {
  t.some(function (n) {
    try {
      n.__h.forEach(Z), n.__h = n.__h.filter(function (e) {
        return !e.__ || ee(e);
      });
    } catch (_) {
      t.some(function (e) {
        e.__h && (e.__h = []);
      }), t = [], e.__e(_, n.__v);
    }
  }), V && V(n, t);
}, e.unmount = function (n) {
  I && I(n);
  var t = n.__c;

  if (t) {
    var _ = t.__H;
    if (_) try {
      _.__.forEach(function (e) {
        return e.t && e.t();
      });
    } catch (n) {
      e.__e(n, t.__v);
    }
  }
};

var _e = function _e(e, n, t, _) {
  var o;
  n[0] = 0;

  for (var r = 1; r < n.length; r++) {
    var u = n[r++],
        l = n[r] ? (n[0] |= u ? 1 : 2, t[n[r++]]) : n[++r];
    3 === u ? _[0] = l : 4 === u ? _[1] = Object.assign(_[1] || {}, l) : 5 === u ? (_[1] = _[1] || {})[n[++r]] = l : 6 === u ? _[1][n[++r]] += l + "" : u ? (o = e.apply(l, _e(e, l, t, ["", null])), _.push(o), l[0] ? n[0] |= 2 : (n[r - 2] = 0, n[r] = o)) : _.push(l);
  }

  return _;
},
    oe = new Map(),
    re = function (e) {
  var n = oe.get(this);
  return n || (n = new Map(), oe.set(this, n)), (n = _e(this, n.get(e) || (n.set(e, n = function (e) {
    for (var n, t, _ = 1, o = "", r = "", u = [0], l = function l(e) {
      1 === _ && (e || (o = o.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? u.push(0, e, o) : 3 === _ && (e || o) ? (u.push(3, e, o), _ = 2) : 2 === _ && "..." === o && e ? u.push(4, e, 0) : 2 === _ && o && !e ? u.push(5, 0, !0, o) : _ >= 5 && ((o || !e && 5 === _) && (u.push(_, 0, o, t), _ = 6), e && (u.push(_, e, 0, t), _ = 6)), o = "";
    }, i = 0; i < e.length; i++) {
      i && (1 === _ && l(), l(i));

      for (var c = 0; c < e[i].length; c++) {
        n = e[i][c], 1 === _ ? "<" === n ? (l(), u = [u], _ = 3) : o += n : 4 === _ ? "--" === o && ">" === n ? (_ = 1, o = "") : o = n + o[0] : r ? n === r ? r = "" : o += n : '"' === n || "'" === n ? r = n : ">" === n ? (l(), _ = 1) : _ && ("=" === n ? (_ = 5, t = o, o = "") : "/" === n && (_ < 5 || ">" === e[i][c + 1]) ? (l(), 3 === _ && (u = u[0]), _ = u, (u = u[0]).push(2, 0, _), _ = 0) : " " === n || "\t" === n || "\n" === n || "\r" === n ? (l(), _ = 2) : o += n), 3 === _ && "!--" === o && (_ = 4, u = u[0]);
      }
    }

    return l(), u;
  }(e)), n), arguments, [])).length > 1 ? n : n[0];
}.bind(a);

exports.html = re; 
