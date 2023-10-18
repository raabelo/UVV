%{
    var VAL_INT, VAL_DOUBLE; // Variáveis globais
    var symTable = [];       // Tabela de símbolos
    %}
    
    %lex
    %%
    "int"                   { console.log('Token: INT'); return 'INT'; }
    "double"                { console.log('Token: DOUBLE'); return 'DOUBLE'; }
    "float"                 { console.log('Token: FLOAT'); return 'FLOAT'; }
    "char"                  { console.log('Token: CHAR'); return 'CHAR'; }
    "("                     { console.log('Token: ('); return '('; }
    ")"                     { console.log('Token: )'); return ')'; }
    "["                     { console.log('Token: ['); return '['; }
    "]"                     { console.log('Token: ]'); return ']'; }
    "{"                     { console.log('Token: {'); return '{'; }
    "}"                     { console.log('Token: }'); return '}'; }
    "*"                     { console.log('Token: *'); return '*'; }
    "+"                     { console.log('Token: +'); return '+'; }
    "-"                     { console.log('Token: -'); return '-'; }
    "/"                     { console.log('Token: /'); return '/'; }
    ","                     { console.log('Token: ,'); return ','; }
    ";"                     { console.log('Token: ;'); return ';'; }
    ":"                     { console.log('Token: :'); return ':'; }
    "."                     { console.log('Token: .'); return '.'; }
    "'"                     { console.log('Token: \''); return "'"; }
    "\""                    { console.log('Token: \"'); return '"'; }
    "<"                     { console.log('Token: <'); return '<'; }
    ">"                     { console.log('Token: >'); return '>'; }
    "="                     { console.log('Token: ='); return '='; }
    "<="                    { console.log('Token: LE'); return 'LE'; }
    ">="                    { console.log('Token: GE'); return 'GE'; }
    "=="                    { console.log('Token: EQ'); return 'EQ'; }
    "!="                    { console.log('Token: NE'); return 'NE'; }
    "&&"                    { console.log('Token: AND'); return 'AND'; }
    "||"                    { console.log('Token: OR'); return 'OR'; }
    "!"                     { console.log('Token: NOT'); return 'NOT'; }
    "if"                    { console.log('Token: IF'); return 'IF'; }
    "switch"                { console.log('Token: SWITCH'); return 'SWITCH'; }
    "case"                  { console.log('Token: CASE'); return 'CASE'; }
    "break"                 { console.log('Token: BREAK'); return 'BREAK'; }
    "default"               { console.log('Token: DEFAULT'); return 'DEFAULT'; }
    "else"                  { console.log('Token: ELSE'); return 'ELSE'; }
    "while"                 { console.log('Token: WHILE'); return 'WHILE'; }
    "for"                   { console.log('Token: FOR'); return 'FOR'; }
    "VAR"                   { console.log('Token: VAR'); return 'VAR'; }
    "do"                    { console.log('Token: DO'); return 'DO'; }
    "do while"                 { console.log('Token: DO WHILE'); return 'DO WHILE'; }
    "#"                     { console.log('Token: #'); return '#'; }
    "define"                { console.log('Token: DEFINE'); return 'DEFINE'; }
    "break"                 { console.log('Token: BREAK'); return 'BREAK'; }
    "continue"              { console.log('Token: CONTINUE'); return 'CONTINUE'; }
    
    [ \s\t\n]+                { console.log('Token: BRANCO'); }
    [a-zA-Z_][a-zA-Z0-9_]*   {console.log('Token IDF'); return 'IDF'; }
    // [0-9]                   { VAL_INT = parseInt(yytext); console.log('Token: INT_LIT'); return 'INT_LIT'}
    [0-9]+                  { VAL_INT = parseInt(yytext); console.log('Token: INT_LIT'); return 'INT_LIT'}
    [0-9]+\.[0-9]+([eE][-+]?[0-9]+)?   { VAL_DOUBLE = parseFloat(yytext); console.log('Token: F_LIT'); return 'F_LIT'}
    \.[0-9]+([eE][-+]?[0-9]+)?           { VAL_DOUBLE = parseFloat(yytext); console.log('Token: F_LIT'); return 'F_LIT'}
    {VAL_DOUBLE}([eE][-+]?[0-9]+)?       { console.log('Token: F_LIT'); return 'F_LIT'}
    .                                   {console.log('Erro léxico: caractere [', yytext, '] não reconhecido.');}
    
    <<EOF>>                             {console.log('Token EOF'); return 'EOF';}
    
    /lex
    
    /* Associações de operadores e precedência */
    
    %left '<' '>' '=' NE LE GE
    %left '+' '-'
    %left '*' '/'
    
    %start corpo
    
    %% /* Gramática */
    
    corpo
        : statements EOF {console.log('Corpo')}
        | EOF
        ;
    
    statements
        : statements statement
        | statement
        ;
    
    statement
        : expression_statement ';'{console.log('Expression Statement')}
        | BREAK ';'{console.log('Break Statement')}
        | CONTINUE ';' {console.log('Continue Statement')}
        | if_stmt
        | switch_stmt {console.log('SWITCH Statement')}
        | repeat_statement
        | return_statement
        ;
    
    if_stmt
        : IF '(' conditional_expression ')' statement ELSE statement
          {console.log('IF ELSE SingleLine Statement')}
        | IF '(' conditional_expression ')' statement
          {console.log('IF SingleLine Statement')}
        | IF '(' conditional_expression ')' '{' statements '}'
          {console.log('IF ELSE MultipleLine Statement')}
        | IF '(' conditional_expression ')' '{' statements '}'
          {console.log('IF MultipleLine Statement')}
        ;
    
    value_lit
        : F_LIT {console.log('Floating Point Literal')}
        | INT_LIT {console.log('Integer Literal')}
        | CHAR_LIT {console.log('Character Literal')}
        | IDF {console.log('Character Literal')}
        | value_lit
        ;
    
    return_statement
        : RETURN value_lit {console.log('Return Statement')}
        ;
    
    expression_statement
        : assignment_expression {console.log('Expression Statement: Assignment Expression');}
        | function_call {console.log('Expression Statement: Function Call');}
        ;
    
    assignment_expression
        : VAR id '=' value_lit {console.log('Expression Statement: Assignment Expression');}
        | INT id '=' value_lit {console.log('Expression Statement: Assignment Expression');}
        | DOUBLE id '=' value_lit {console.log('Expression Statement: Assignment Expression');}
        | FLOAT id '=' value_lit {console.log('Expression Statement: Assignment Expression');}
        | CHAR id '='value_lit {console.log('Expression Statement: Assignment Expression');}
        // | value_lit '+' '+' {console.log('Expression Statement: Assignment Expression');}
        // | value_lit '-' '-' {console.log('Expression Statement: Assignment Expression');}
        ;
    
    id
        : IDF { symTable.push($1); } /* $1 representa o valor reconhecido de IDF */
        ;
    
    function_call
        : DEFINE IDF '(' params_stmt ')' '{' statement '}' {console.log('Expression Statement: Function Call');}
        | DEFINE IDF '(' params_stmt ')' ':' statement {console.log('Expression Statement: Function Call');}
        | IDF '(' params_stmt ')' statement {console.log('Expression Statement: Function Call');}
        | IDF '(' params_stmt ')' ';' statement {console.log('Expression Statement: Function Call');}
        ;
    
    params_stmt
        : IDF {console.log('Params passed');}
        | IDF ',' params_stmt {console.log('Params passed');}
        ;
    
    switch_stmt
        : SWITCH '(' IDF ')' '{' case_block '}'
          {console.log('Switch Statement');}
        ;
    
    case_block
        : case_statements
        | /* caso vazio ou outras regras conforme necessário */
        ;
    
    case_statements
        : case_statement
        | case_statements case_statement
        ;
    
    case_statement
        : CASE value_lit ':' statements
          {console.log('Case Statement');}
        | DEFAULT ':' statements
          {console.log('Default Case Statement');}
        ;
    
    repeat_statement
        : DO statements WHILE '(' conditional_expression ')' ';'
          {console.log('Do-While Statement');}
        | WHILE '(' conditional_expression ')' statements
          {console.log('While Statement');}
        | FOR '(' assignment_expression ';' conditional_expression ';' expression ')' statement
          {console.log('For Statement');}
        ;
    
    return_statement
        : RETURN value_lit ';'
          {console.log('Return Statement');}
        ;
    
    conditional_expression
        : expression '<' expression
        | expression '>' expression
        | expression 'EQ' expression
        | expression 'NE' expression
        | expression 'GE' expression
        | expression 'LE' expression
        | expression 'AND' expression
        | expression 'OR' expression
        ;
    
    expression
        : expression '+' expression
        | expression '-' expression
        | expression '*' expression
        | expression '/' expression
        | expression '^' expression
        | '-' expression
        | '(' expression ')'
        | expression '+' '+'
        | expression '-' '-'
        | value_lit
        ;