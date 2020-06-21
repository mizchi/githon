import is from "is";
import semver from "semver";
import Immutable from "immutable";

import PREFIX from "../constants/pluginPrefix";
const DEFAULT_VERSION = "*";

/*
 * PluginDependency represents the informations about a plugin
 * stored in config.plugins
 */
const PluginDependency = Immutable.Record(
    {
        name: String(),

        // Requirement version (ex: ">1.0.0")
        version: String(DEFAULT_VERSION),

        // path to package
        path: String(),

        // Is this plugin enabled or disabled?
        enabled: Boolean(true),
    },
    "PluginDependency"
);

PluginDependency.prototype.getName = function () {
    return this.get("name");
};

PluginDependency.prototype.getVersion = function () {
    return this.get("version");
};

PluginDependency.prototype.getPath = function () {
    return this.get("path");
};

PluginDependency.prototype.isEnabled = function () {
    return this.get("enabled");
};

/**
 * Toggle this plugin state
 * @param  {Boolean}
 * @return {PluginDependency}
 */
PluginDependency.prototype.toggle = function (state) {
    if (is.undef(state)) {
        state = !this.isEnabled();
    }

    return this.set("enabled", state);
};

/**
 * Return NPM ID for the dependency
 * @return {String}
 */
PluginDependency.prototype.getNpmID = function () {
    // @ts-expect-error
    return PluginDependency.nameToNpmID(this.getName());
};

/**
 * Is the plugin using a git dependency
 * @return {Boolean}
 */
PluginDependency.prototype.isGitDependency = function () {
    return !semver.validRange(this.getVersion());
};

/**
 * Create a plugin with a name and a plugin
 * @param {String}
 * @return {Plugin|undefined}
 */
// @ts-expect-error
PluginDependency.create = function (name, version, enabled) {
    if (is.undefined(enabled)) {
        enabled = true;
    }

    return new PluginDependency({
        name: name,
        version: version || DEFAULT_VERSION,
        enabled: Boolean(enabled),
    });
};

/**
 * Create a plugin from a string
 * @param {String}
 * @return {Plugin|undefined}
 */
// @ts-expect-error
PluginDependency.createFromString = function (s) {
    const parts = s.split("@");
    let name = parts[0];
    const version = parts.slice(1).join("@");
    let enabled = true;

    if (name[0] === "-") {
        enabled = false;
        name = name.slice(1);
    }

    return new PluginDependency({
        name: name,
        version: version || DEFAULT_VERSION,
        enabled: enabled,
    });
};

/**
 * Create a PluginDependency from a string
 * @param {String}
 * @return {List<PluginDependency>}
 */
// @ts-expect-error
PluginDependency.listFromString = function (s) {
    const parts = s.split(",");
    // @ts-expect-error
    return PluginDependency.listFromArray(parts);
};

/**
 * Create a PluginDependency from an array
 * @param {Array}
 * @return {List<PluginDependency>}
 */
// @ts-expect-error
PluginDependency.listFromArray = function (arr) {
    return Immutable.List(arr)
        .map((entry) => {
            if (is.string(entry)) {
                // @ts-expect-error
                return PluginDependency.createFromString(entry);
            } else {
                return PluginDependency({
                    // @ts-expect-error
                    name: entry.get("name"),
                    // @ts-expect-error
                    version: entry.get("version"),
                });
            }
        })
        .filter((dep) => {
            return Boolean(dep.getName());
        });
};

/**
 * Export plugin dependencies as an array
 * @param {List<PluginDependency>} list
 * @return {Array<String>}
 */
// @ts-expect-error
PluginDependency.listToArray = function (list) {
    return list
        .map((dep) => {
            let result = "";

            if (!dep.isEnabled()) {
                result += "-";
            }

            result += dep.getName();
            if (dep.getVersion() !== DEFAULT_VERSION) {
                result += `@${dep.getVersion()}`;
            }

            return result;
        })
        .toJS();
};

/**
 * Return NPM id for a plugin name
 * @param {String}
 * @return {String}
 */
// @ts-expect-error
PluginDependency.nameToNpmID = function (s) {
    return PREFIX + s;
};

export default PluginDependency;