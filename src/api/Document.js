export const Document = {
  async create(data) {
    console.log("Criando documento simulado", data);
    return { id: "mock-id", ...data };
  },
  async list() {
    return [];
  }
};
