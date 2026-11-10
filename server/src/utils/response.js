export function ok(res, data = null, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function created(res, data = null, message = 'Created') {
  return ok(res, data, message, 201);
}

export function fail(res, statusCode, message, errors) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}
