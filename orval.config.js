require("dotenv").config({ path: ".env.local" });

module.exports = {
	"umbraco-transfomer": {
		output: {
			mode: "tags-split",
			target: "./src/api/client.ts",
			baseUrl: process.env.NEXT_PUBLIC_UMBRACO_BASE_URL,
			schemas: "./src/api/model",
			client: "fetch",
			override: {
				mutator: {
					path: "./src/custom-fetch.ts",
					name: "customFetch",
				},
			},
		},
		input: {
			target: `${process.env.NEXT_PUBLIC_UMBRACO_BASE_URL}/umbraco/swagger/delivery/swagger.json`,
		},
	},
};