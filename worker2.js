exports.handler = async () => {
  return { worker: "Worker 2", handledAt: new Date().toISOString() };
};
