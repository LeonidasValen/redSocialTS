"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
app_1.default.use('/auth', auth_routes_1.default);
app_1.default.use('/user', user_routes_1.default);
app_1.default.use('/admins', admin_routes_1.default);
app_1.default.use('/post', post_routes_1.default);
app_1.default.listen(config_1.PORT, () => {
    console.log(`el server esta corriendo en: http://localhost:${config_1.PORT}`);
});
app_1.default.get('/', (req, res) => {
    res.send("bienvenido al backend!");
});
