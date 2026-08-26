<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Title from '$lib/components/Title.svelte';

	const expenses: ExpenseInput[] = [
		{
			date: '28.07.2025',
			text: 'VPS (multi-purpose; used primarily for things other than Mupen64)',
			billed: '@crackhex',
			sum: '$165.39'
		},
		{
			date: '13.09.2025',
			text: 'mupen64.com registration (2 years)',
			billed: '@abart27',
			sum: '$26.66'
		},
		{
			date: '09.03.2026',
			text: 'mupen64.com renewal (1 year)',
			billed: '@abart27',
			sum: '$18.68'
		},
		{
			date: '28.07.2026',
			text: 'VPS renewal (multi-purpose; used primarily for things other than Mupen64)',
			billed: '@crackhex',
			sum: '$184.89'
		},
		{
			date: '20.08.2026',
			text: 'mupen64.com renewal (2 years)',
			billed: '@abart27',
			sum: '$37.36'
		},
		{
			date: '21.08.2026',
			note: 'Moved Mupen64 infrastructure off the VPS'
		}
	];

	type ExpenseInput =
		{ date: string; text: string; billed: string; sum: string } | { date: string; note: string };

	type Statement = {
		year: number;
		expenses: { date: string; item: string; paidBy?: string; amount?: number }[];
	};

	const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

	function parseAmount(sum: string): number {
		return Number(sum.replace(/[^0-9.]/g, ''));
	}

	function yearOf(date: string): number {
		return Number(date.split('.').at(-1));
	}

	const statements: Statement[] = expenses.reduce<Statement[]>((acc, expense) => {
		const year = yearOf(expense.date);
		let statement = acc.find((s) => s.year === year);
		if (!statement) {
			statement = { year, expenses: [] };
			acc.push(statement);
		}
		statement.expenses.push(
			'note' in expense
				? { date: expense.date, item: expense.note }
				: {
						date: expense.date,
						item: expense.text,
						paidBy: expense.billed,
						amount: parseAmount(expense.sum)
					}
		);
		return acc;
	}, []);

	function yearTotal(statement: Statement): number {
		return statement.expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0);
	}

	const yearRange = statements.map((s) => s.year).join('–');
	const grandTotal = statements.reduce((sum, statement) => sum + yearTotal(statement), 0);
</script>

<main>
	<section
		class="border-b border-dashed border-slate-400/70 bg-slate-100/50 p-16 pt-24 pb-12 shadow-sm dark:border-slate-600/70 dark:bg-slate-900/30"
	>
		<div class="mx-auto max-w-6xl">
			<h1 class="text-4xl font-bold">Expenses</h1>
			<p class="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
				Expenses of the Mupen64 Organization in the range {yearRange}. <br />
			</p>
		</div>
	</section>

	<section class="pt-16 pb-16">
		<div class="mx-auto max-w-6xl">
			<Title id="expenses">Expenses by Year</Title>

			<div class="mb-12 last:mb-0">
				<h2 class="mb-3 text-xl font-semibold">2022-2024</h2>
				<p>No expenses in this time period.</p>
			</div>

			{#each statements as s (s.year)}
				{@const total = yearTotal(s)}
				<div class="mb-12 last:mb-0">
					<h2 class="mb-3 text-xl font-semibold">{s.year}</h2>
					<Table
						class="w-full overflow-hidden rounded-xl text-left text-sm shadow-sm"
						striped={true}
					>
						<TableHead>
							<TableHeadCell class="font-semibold">Date</TableHeadCell>
							<TableHeadCell class="font-semibold">Item</TableHeadCell>
							<TableHeadCell class="font-semibold">Paid by</TableHeadCell>
							<TableHeadCell class="text-right font-semibold">Amount</TableHeadCell>
						</TableHead>
						<TableBody>
							{#if s.expenses.length > 0}
								{#each s.expenses as expense (expense.date)}
									{#if expense.amount !== undefined}
										<TableBodyRow>
											<TableBodyCell>{expense.date}</TableBodyCell>
											<TableBodyCell>{expense.item}</TableBodyCell>
											<TableBodyCell>{expense.paidBy}</TableBodyCell>
											<TableBodyCell class="text-right"
												>{currency.format(expense.amount)}</TableBodyCell
											>
										</TableBodyRow>
									{:else}
										<TableBodyRow>
											<TableBodyCell>{expense.date}</TableBodyCell>
											<TableBodyCell colspan={3}>
												{expense.item}
											</TableBodyCell>
										</TableBodyRow>
									{/if}
								{/each}
								<TableBodyRow>
									<TableBodyCell colspan={3} class="font-bold">Total ({s.year})</TableBodyCell>
									<TableBodyCell class="text-right font-bold"
										>{currency.format(total)}</TableBodyCell
									>
								</TableBodyRow>
							{:else}
								<TableBodyRow>
									<TableBodyCell colspan={4} class="text-slate-400 dark:text-slate-500">
										No expenses
									</TableBodyCell>
								</TableBodyRow>
							{/if}
						</TableBody>
					</Table>
				</div>
			{/each}

			<p class="text-right text-slate-600 dark:text-slate-300">
				Total expenses ({yearRange}): <span class="font-bold">{currency.format(grandTotal)}</span>
			</p>
		</div>
	</section>
</main>
