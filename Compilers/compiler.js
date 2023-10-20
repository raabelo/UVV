%{
  var VAL_INT, VAL_DOUBLE; // Variáveis globais
  var symTable = [];       // Tabela de símbolos
%}
  
%lex
%%
  
//ignore
[\s]+                                { console.log('Token: BRANCO'); }
[\t]+                                { console.log('Token: BRANCO'); }
[\n]+                                { console.log('Token: BRANCO'); }
[\r]+                                { console.log('Token: BRANCO'); }
[ ]+                                 { console.log('Token: BRANCO'); }
[\#]+[\/\'\"a-zA-Zà-úÀ-Ú0-9._,-\s><*]+[\r\n]+                                 { console.log('Token: IMPORT'); }
[\/\/]+[\&\!\|\'\"a-zA-Zà-úÀ-Ú0-9._,-\s><*]+[\r\n]+                            { console.log('Token: COMMENT'); }

"int"                   { console.log('Token: INT');       return 'INT'; }
"double"                { console.log('Token: DOUBLE');    return 'DOUBLE'; }
"float"                 { console.log('Token: FLOAT');     return 'FLOAT'; }
"char"                  { console.log('Token: CHAR');      return 'CHAR'; }
"<="                    { console.log('Token: LE');        return 'LE'; }
">="                    { console.log('Token: GE');        return 'GE'; }
"=="                    { console.log('Token: EQ');        return 'EQ'; }
"!="                    { console.log('Token: NE');        return 'NE'; }
"&&"                    { console.log('Token: AND');       return 'AND'; }
"||"                    { console.log('Token: OR');        return 'OR'; }
"="                     { console.log('Token: =');         return '='; }
"("                     { console.log('Token: (');         return '('; }
")"                     { console.log('Token: )');         return ')'; }
"["                     { console.log('Token: [');         return '['; }
"]"                     { console.log('Token: ]');         return ']'; }
"{"                     { console.log('Token: {');         return '{'; }
"}"                     { console.log('Token: }');         return '}'; }
"%"                     { console.log('Token: %');         return '%'; }
"*"                     { console.log('Token: *');         return '*'; }
"+"                     { console.log('Token: +');         return '+'; }
"-"                     { console.log('Token: -');         return '-'; }
"/"                     { console.log('Token: /');         return '/'; }
","                     { console.log('Token: ,');         return ','; }
";"                     { console.log('Token: ;');         return ';'; }
":"                     { console.log('Token: :');         return ':'; }
"."                     { console.log('Token: .');         return '.'; }
"\""                    { console.log('Token: \"');        return '"'; }
"<"                     { console.log('Token: <');         return '<'; }
">"                     { console.log('Token: >');         return '>'; }
"'"                     { console.log('Token: \'');        return "QUOTE"; }
"!"                     { console.log('Token: NOT');       return 'NOT'; }
"if"                    { console.log('Token: IF');        return 'IF'; }
"switch"                { console.log('Token: SWITCH');    return 'SWITCH'; }
"case"                  { console.log('Token: CASE');      return 'CASE'; }
"break"                 { console.log('Token: BREAK');     return 'BREAK'; }
"default"               { console.log('Token: DEFAULT');   return 'DEFAULT'; }
"else"                  { console.log('Token: ELSE');      return 'ELSE'; }
"while"                 { console.log('Token: WHILE');     return 'WHILE'; }
"for"                   { console.log('Token: FOR');       return 'FOR'; }
"VAR"                   { console.log('Token: VAR');       return 'VAR'; }
"do"                    { console.log('Token: DO');        return 'DO'; }
"break"                 { console.log('Token: BREAK');     return 'BREAK'; }
"continue"              { console.log('Token: CONTINUE');  return 'CONTINUE'; }
"define"                { console.log('Token: DEFINE');    return 'DEFINE'; }
// "#"                  { console.log('Token: #');         return '#'; }

//regex
[0-9]+"."[0-9]+(e[+-]?[0-9]+)?      return 'F_LIT';
[0-9]+(e[+-]?[0-9]+)?               return 'F_LIT';
[0-9]+                              { VAL_INT = parseInt(yytext); console.log('Token: INT_LIT'); return 'INT_LIT'}
[a-zA-Z_][a-zA-Z0-9_.]*             { console.log('Token IDF'); return 'IDF'; }

//regex
// [a-zA-Z_][a-zA-Z0-9_.]*             { console.log('Token IDF'); return 'IDF'; }
// [0-9]+                              { VAL_INT = parseInt(yytext); console.log('Token: INT_LIT'); return 'INT_LIT'}
// [+-]?\d+(\.\d+)?([eE][+-]?\d+)?     { VAL_DOUBLE = parseFloat(yytext); console.log('Token: F_LIT'); return 'F_LIT'}
// {VAL_DOUBLE}([eE][-+]?[0-9]+)?      { console.log('Token: F_LIT'); return 'F_LIT'}
// \.[0-9]+([eE][-+]?[0-9]+)?          { VAL_DOUBLE = parseFloat(yytext); console.log('Token: F_LIT'); return 'F_LIT'}

.                                   { console.log('Erro léxico: caractere [', yytext, '] não reconhecido.'); return 'ERROR'}
                                                
<<EOF>>                             {console.log('Token EOF'); return 'EOF';}

/lex

/* Associações de operadores e precedência */

%left '<' '>' '=' NE LE GE EQ NOT OR AND
%left '+' '-'
%left '*' '/' '%'

%start corpo

%% /* Gramática */

corpo
  : statements EOF {console.log('Corpo')}    
  | '{' statements '}' EOF {console.log('Corpo')}
  | EOF
  ;

statements
  : statements statement
  | statement statements
  | statements statements
  | statement
  | ';' EOF
  ;
  
statement
  : '{' statement '}'
  | '{''}'
  | '{' statements '}'
  | expression_statement ';' {console.log('Expression Statement')}
  | expression_statement {console.log('Expression Statement')}
  | BREAK ';'{console.log('Break Statement')}
  | CONTINUE ';' {console.log('Continue Statement')}
  | if_stmt
  | value_lit
  | do_stmt
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
  | IF '(' conditional_expression ')' '{' statements '}' ELSE statement
    {console.log('IF ELSE MultipleLine Statement')}
  | IF '(' conditional_expression ')' '{' statements '}' ELSE statements
    {console.log('IF MultipleLine Statement')}
  ;

array_stmt
  : value_lit {console.log('Array');}
  | value_lit ',' array_stmt {console.log('Array');}
  ;

params_stmt
  : IDF {console.log('Params passed');}
  | IDF ',' params_stmt {console.log('Params passed');}
  ;

switch_stmt
  : SWITCH expression '{' case_block '}'
    {console.log('Switch Statement');}
  ;

parse_stmt
  : '(' var_type ')'
  ;

value_lit
  : F_LIT {console.log('Floating Point Literal')}
  | INT_LIT {console.log('Integer Literal')}
  | CHAR_LIT {console.log('Character Literal')}
  | IDF {console.log('Character Literal')}
  | 'QUOTE' IDF 'QUOTE' {console.log('Character Literal')}
  | value_lit'[' array_stmt ']'
  | '[' array_stmt ']'
  | parse_stmt value_lit
  | value_lit
  ;

return_statement
  : RETURN value_lit {console.log('Return Statement')}
  ;

expression_statement
  : assignment_expression {console.log('Expression Statement: Assignment Expression');}
  | function_call {console.log('Expression Statement: Function Call');}
  | expression {console.log('Expression Statement: Function Call');}
  ;

var_type
  : 'VAR'
  | 'INT'
  | 'DOUBLE'
  | 'FLOAT'
  | 'CHAR'
  | 'VAR'
  | 'INT'
  | 'DOUBLE'
  | 'FLOAT'
  | 'CHAR'
  ;
  
assignment_expression
  : var_type id '=' value_lit {console.log('Expression Statement: Assignment Expression');}
  | id value_lit {console.log('Expression Statement: Assignment Expression');}
  | var_type id ';' {console.log('Expression Statement: Assignment Expression');}
  | var_type id '[' value_lit ']' '=' '{' array_stmt '}' {console.log('Expression Statement: Assignment Expression');}
  | var_type id '[' value_lit ']' ';' {console.log('Expression Statement: Assignment Expression');}
  | value_lit '=' value_lit
  | value_lit '=' expression
  | id '=' value_lit
  | expression '=' expression
  | value_lit '+''=' value_lit
  | value_lit '-''=' value_lit
  | value_lit '*''=' value_lit
  | value_lit '/''=' value_lit
  | value_lit '+' '+'
  | value_lit '-' '-'
  | value_lit
  ;

id
  : IDF { symTable.push($1); } /* $1 representa o valor reconhecido de IDF */
  | IDF ',' IDF { symTable.push($1); symTable.push($3);} /* $1 representa o valor reconhecido de IDF */
  ;

function_call
  : DEFINE IDF '(' params_stmt ')' '{' statement '}' {console.log('Expression Statement: Function Call');}
  | DEFINE IDF '(' params_stmt ')' ':' statement {console.log('Expression Statement: Function Call');}
  | DEFINE assignment_expression {console.log('Expression Statement: Function Call');}
  | IDF '(' params_stmt ')' statement {console.log('Expression Statement: Function Call');}
  | IDF '(' params_stmt ')' ';' statement {console.log('Expression Statement: Function Call');}
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
  | CASE value_lit ':'
  | DEFAULT ':' statements
    {console.log('Default Case Statement');}
  ;

do_stmt
  : DO statement WHILE '(' conditional_expression ')' ';'
    { console.log('Do-While Statement'); } 
  ;

repeat_statement  
  : WHILE '(' conditional_expression ')' statements
    { console.log('While Statement'); }
  | FOR '(' assignment_expression ';' conditional_expression ';' expression ')' for_stmt
    { console.log('For Statement'); }
  ;
  
for_stmt
  : '{''}'
  | '{' statement '}'
  | '{' statements '}'
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
  | 'NOT' expression
  | expression expression
  | conditional_expression conditional_expression 
  ;

expression
  : expression '%' expression
  | expression '+' expression
  | expression '-' expression
  | expression '*' expression
  | expression '/' expression
  | expression '^' expression
  | '%' expression
  | '+' expression
  | '-' expression
  | '*' expression
  | '/' expression
  | '^' expression
  | '-' expression
  | '(' expression ')'
  | expression '+' '+'
  | expression '-' '-'
  | conditional_expression 
  | value_lit
  ;