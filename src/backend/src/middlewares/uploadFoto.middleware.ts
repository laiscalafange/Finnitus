import type {
  Request,
  Response,
  NextFunction,
} from "express";

import multer from "multer";
import { HttpError } from "../utils/errors.js";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 0,
  },

  fileFilter: (_req, file, cb) => {
    const formatosPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!formatosPermitidos.includes(file.mimetype)) {
      return cb(
        new HttpError(
          400,
          "Envie uma imagem JPG, PNG ou WEBP.",
        ),
      );
    }

    cb(null, true);
  },
});

export function uploadFotoPerfil(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  upload.single("foto")(req, res, (erro) => {
    if (erro instanceof multer.MulterError) {
      if (erro.code === "LIMIT_FILE_SIZE") {
        return next(
          new HttpError(
            400,
            "A imagem deve ter no máximo 5 MB.",
          ),
        );
      }

      return next(
        new HttpError(
          400,
          "Arquivo inválido ou campo inesperado.",
        ),
      );
    }

    if (erro) {
      return next(
        erro instanceof HttpError ? erro : new HttpError(400, "Envio da foto inválido."),
      );
    }

    next();
  });
}
