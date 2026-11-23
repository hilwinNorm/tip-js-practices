// Локальный сервер статических файлов. Он не реализует API и не сохраняет задачи.
import http from "node:http";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = await realpath(fileURLToPath(new URL("../", import.meta.url)));
const port = Number(process.argv[2] ?? 5503);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  console.error("Порт должен быть целым числом от 1024 до 65535.");
  process.exit(1);
}

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
]);

function allowedFile(name) {
  return ["index.html", "checks.html", "styles.css"].includes(name)
    || name.startsWith("src/")
    || name.startsWith("examples/")
    || name.startsWith("checks/");
}
function sendText(res, status, message, head = false) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(head ? undefined : message);
}

const server = http.createServer(async (req, res) => {
  const head = req.method === "HEAD";
  if (req.method !== "GET" && !head) {
    res.setHeader("Allow", "GET, HEAD");
    sendText(res, 405, "Method not allowed", head);
    return;
  }

  try {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    } catch {
      sendText(res, 400, "Bad request", head);
      return;
    }
    if (pathname.includes("\\") || pathname.includes("\0")
        || pathname.split("/").some((part) => part.startsWith("."))) {
      sendText(res, 403, "Forbidden", head);
      return;
    }

    const name = pathname === "/" ? "index.html" : pathname.slice(1);
    const type = types.get(path.extname(name));
    if (!allowedFile(name) || !type) {
      sendText(res, 404, "Not found", head);
      return;
    }

    const filename = await realpath(path.join(root, name));
    const relative = path.relative(root, filename);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      sendText(res, 403, "Forbidden", head);
      return;
    }
    const body = await readFile(filename);
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(head ? undefined : body);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendText(res, 404, "Not found", head);
      return;
    }
    console.error(error);
    sendText(res, 500, "Internal server error", head);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Локальный сервер запущен: http://127.0.0.1:${port}/`);
  console.log("Остановка: Ctrl+C");
});
