import { Command } from "commander";

const args = new Command();

args.option("--env <env>", "environment", "dev");
args.option("--persistence <persistence>", "persistence", "mongo");
args.option("-u <user>", "user");

args.parse();
export default args.opts();