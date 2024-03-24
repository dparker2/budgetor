-- create development things
insert into users (email, password) values (
    'dev@local',
    '95e2a4a09239f6c34a9eb4597b0c05167c1495ec861ad252b27841a7c9b213186288216c4759190854737e07a5650c36f91167bbf2562de04f4ab456e7abf596:381a2912d6281967cffcf185e76ed2d4'
);

insert into categories (owner, name) values
    (1, 'Household'),
    (1, 'Groceries'),
    (1, 'Gas');

insert into expenselogs (owner, name) values
    (1, 'Log 1 (1/1/2024-1/14-2024)'),
    (1, 'Log 2 (1/15/2024-1/28-2024)');

insert into expenses (log, date, amount, description, category) values
    (1, '1/1/2024', 100, 'Target', 1),
    (1, '1/15/2024', 200, 'Walmart', 2),
    (2, '1/15/2024', 300, 'Costco Gas', 3);
