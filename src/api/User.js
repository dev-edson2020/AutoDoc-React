export const User = {
  async me() {
    return {
      full_name: "Usuário Teste",
      email: "teste@autodoc.com",
      role: "admin"
    };
  }
};
