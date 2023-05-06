import { Client } from "../cloudcord";
import main from "./commands/main";
import { raw } from "./config";

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const client = new Client<Env, typeof raw>(env, raw);
    main(client, env);

    if (url.pathname === "/register") {
      return new Response(JSON.stringify(await client.commands.register()), {
        headers: { "content-type": "application/json" },
      });
    } else {
      return client.handleRequest(request);
    }
  },
};
