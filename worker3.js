exports.handler = async () => {
  return { worker: "Worker 3", handledAt: new Date().toISOString() };
};
