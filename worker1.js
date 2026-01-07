exports.handler = async () => {
  return { worker: "Worker 1", handledAt: new Date().toISOString() };
};
