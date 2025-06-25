
export const User = {
  async me() {
    return {
      full_name: "Usuário Teste",
      email: "teste@autodoc.com",
      role: "admin"
    };
  },
  async login() {
    console.log("Login desativado - ambiente local.");
  },
  async logout() {
    console.log("Logout desativado - ambiente local.");
  }
};
