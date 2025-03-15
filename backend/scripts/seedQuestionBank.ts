import seedData from "../resources/seedData.json";
import { supabase } from "../src/config/supabase";
import { QuestionBank } from "../src/types/database.types";

async function seedQuestionBank() {
	console.log("Starting to seed question bank...");

	try {
		// First, check if we already have data to avoid duplicates
		const { data: existingData, error: checkError } = await supabase
			.from("question_bank")
			.select("count");

		if (checkError) {
			throw new Error(`Error checking existing data: ${checkError.message}`);
		}

		if (existingData && existingData[0]?.count > 0) {
			console.log(
				`Found ${existingData[0].count} existing records. Do you want to continue?`
			);
			console.log(
				"If you want to continue anyway, re-run with the --force flag"
			);

			// Check if --force flag is present
			if (!process.argv.includes("--force")) {
				console.log("Exiting without seeding. Use --force to override.");
				return;
			}
			console.log("Force flag detected. Continuing with seed operation...");
		}

		// Prepare data for insertion
		const questionsToInsert = seedData.map((item) => ({
			city: item.city,
			country: item.country,
			clues: item.clues,
			fun_fact: item.fun_fact,
			trivia: item.trivia,
		}));

		// Insert data into question_bank table
		const { data, error } = await supabase
			.from("question_bank")
			.insert(questionsToInsert)
			.select();

		if (error) {
			throw new Error(`Error inserting seed data: ${error.message}`);
		}

		console.log(`Successfully added ${data.length} questions to the database!`);
		console.log("Seed data:");
		data.forEach((item: QuestionBank, index: number) => {
			console.log(
				`${index + 1}. ${item.city}, ${item.country} (ID: ${item.qbid})`
			);
		});
	} catch (error) {
		console.error("Error seeding question bank:", error);
		process.exit(1);
	}

	console.log("Seeding complete!");
	process.exit(0);
}

// Execute the seed function
seedQuestionBank();
