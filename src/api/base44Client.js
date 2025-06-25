export const base44 = {
  entities: {
    Document: {
      async create(data) {
        console.log("Documento simulado criado:", data);
        return { id: "mock-id", ...data };
      },
      async list() {
        return [];
      }
    }
  },
  auth: {
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
  }
};
