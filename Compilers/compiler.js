%{

  var escopoAtual = 0;
  var tabelaSimbolos = [];
  var tac = [];
  var erros = [];
  var dentroArray = false;

  var tempVarCount = 0;

function criarVariavel(tipo, nomes, valor, escopo) {
    if (!Array.isArray(nomes)) {
      nomes = [nomes];
    }
    
    if (!valor.includes("{")) {
      if(valor === "undefined") {
        switch(tipo){
          case "int": 
            valor = 0;
            break;
          case "float":
          case "double":
            valor = 0.0;
            break;
          case "char":
            valor = "";
            break;
          default:
            break;
        }
      }      
    }
    
    nomes.forEach(nome => {
      let test = (tabelaSimbolos.filter(e => e.nome === nome)) 
      if(test.length > 0) {
        erros.push({type: "already exists", details: `--${nome}-- already exists`})
        console.log(`Novo erro: \n
          type: already exists \n
          details: --${nome}-- already exists
      `)
        throw new Error(`--${nome}-- already exists`)
        // return        
      }
      tabelaSimbolos.push({ tipo: tipo, nome: nome, valor: valor, escopo: escopo });
  
      console.log(`Variavel criada: \n
        tipo: ${tipo} \n
        nome: ${nome} \n
        valor: ${valor} \n
        escopo: ${escopo} \n
      `);
    });
}

function addInstruction(op, arg1, arg2, result) {
  let test = (tac.filter(e => (e.arg1 === arg1 && e.arg2 === arg2)))
  if(test.length > 0) {
    tempVarCount--
    return
  }

  varArg1 = tabelaSimbolos.find(e => e.nome === arg1)
  varArg2 = tabelaSimbolos.find(e => e.nome === arg2)

  let allowed = false
  if(varArg1 && varArg2){
    if(varArg1.tipo === varArg2.tipo) {
      allowed = true
    }
    else{
      erros.push({type: "types not equal", details: `--${arg1}-- & --${arg2}-- are not the same type`})
        console.log(`Novo erro: \n
          type: already exists \n
          details: --${arg1}-- & --${arg2}-- are not the same type
      `)
        throw new Error(`--${arg1}-- & --${arg2}-- are not the same type`)
    }

    if(escopoAtual < varArg1.escopo || escopoAtual < varArg2.escopo) {
      console.log(escopoAtual)
      console.log(varArg1)
      console.log(varArg2)
      erros.push({type: "scope not reachable", details: `current scope is not reachable by either ${varArg1.nome} or ${varArg2.nome}`})
      console.log(`Novo erro: \n
      type: scope not reachable \n
      details: current scope is not reachable by either ${varArg1.nome} or ${varArg2.nome}
      `)
      throw new Error(`current scope is not reachable by either ${varArg1.nome} or ${varArg2.nome}`)
    }
    else{
      allowed = true
    }
  } else {    
    allowed = true
  }

  if(allowed){
    console.log(`Three Address Code criado: \n
      operação: ${op} \n
      arg1: ${arg1} \n
      arg2: ${arg2} \n
      resultado: ${result} \n
      `)
      tac.push({ op, arg1, arg2, result });
  }
}

function createTempVar() {
    return 't' + (tempVarCount++);
}


%}
  
%lex
%%
  
//ignore
[\s]+                                {  }
[\t]+                                {  }
[\n]+                                {  }
[\r]+                                {  }
[ ]+                                 {  }
[\#]+[\/\'\"a-zA-Zà-úÀ-Ú0-9._,-\s><*]+[\r\n]+                                 { }
[\/\/]+[\&\!\|\'\"a-zA-Zà-úÀ-Ú0-9._,-\s><*]+[\r\n]+                           { }

"{"                     { escopoAtual++; console.log(`-- escopo: ${escopoAtual} --`);      return '{'; }
"}"                     { escopoAtual--; console.log(`-- escopo: ${escopoAtual} --`);      return '}'; }

"int"                   { return 'INT'; }
"double"                { return 'DOUBLE'; }
"float"                 { return 'FLOAT'; }
"char"                  { return 'CHAR'; }
"<="                    { return 'LE'; }
">="                    { return 'GE'; }
"=="                    { return 'EQ'; }
"!="                    { return 'NE'; }
"&&"                    { return 'AND'; }
"||"                    { return 'OR'; }
"="                     { return '='; }
"("                     { return '('; }
")"                     { return ')'; }
"["                     { return '['; }
"]"                     { return ']'; }
"%"                     { return '%'; }
"*"                     { return '*'; }
"+"                     { return '+'; }
"-"                     { return '-'; }
"/"                     { return '/'; }
","                     { return ','; }
";"                     { return ';'; }
":"                     { return ':'; }
"."                     { return '.'; }
"\""                    { return '"'; }
"<"                     { return '<'; }
">"                     { return '>'; }
"'"                     { return "QUOTE"; }
"!"                     { return 'NOT'; }
"if"                    { return 'IF'; }
"switch"                { return 'SWITCH'; }
"case"                  { return 'CASE'; }
"break"                 { return 'BREAK'; }
"default"               { return 'DEFAULT'; }
"else"                  { return 'ELSE'; }
"while"                 { return 'WHILE'; }
"for"                   { return 'FOR'; }
"VAR"                   { return 'VAR'; }
"do"                    { return 'DO'; }
"break"                 { return 'BREAK'; }
"continue"              { return 'CONTINUE'; }
"define"                { return 'DEFINE'; }
// "#"                  { console.log('Token: #');         return '#'; }

//regex
[0-9]+"."[0-9]+(e[+-]?[0-9]+)?      return 'F_LIT';
[0-9]+                              { VAL_INT = parseInt(yytext); return 'INT_LIT'}
[a-zA-Z_][a-zA-Z0-9_.]*             { return 'IDF'; }

.                                   { console.log('Erro léxico: caractere [', yytext, '] não reconhecido.'); return 'ERROR'}
                                                
<<EOF>>                             { console.log('<<EOF>>'); return 'EOF'; }


/lex

/* Associações de operadores e precedência */

%left '<' '>' '=' NE LE GE EQ NOT OR AND
%left '+' '-'
%left '*' '/' '%'

%start body

%% /* Gramática */

body
  : file {
    console.log("\n")
    console.log("Tabela de símbolos");
    console.log(tabelaSimbolos);
    console.log("\n\n")
    console.log("Three Address Codes");
    console.log(tac);
    console.log("\n\n");
    console.log("Erros");
    console.log(erros);
    console.log("\n\n");
  }
  ;

file
  : statements EOF
  | '{' statements '}' EOF
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
  | expression_statement ';'
  | expression_statement
  | BREAK ';'
  | CONTINUE ';' 
  | if_stmt
  | value_lit
  | do_stmt
  | switch_stmt 
  | repeat_statement
  | return_statement
  ;

if_stmt
  : IF '(' conditional_expression ')' statement ELSE statement
  | IF '(' conditional_expression ')' statement
  | IF '(' conditional_expression ')' '{' statements '}'
  | IF '(' conditional_expression ')' '{' statements '}'
  | IF '(' conditional_expression ')' '{' statements '}' ELSE statement
  | IF '(' conditional_expression ')' '{' statements '}' ELSE statements
  ;

array_stmt
  : value_lit { $$ = [$1]; }
  | array_stmt ',' value_lit { 
      var tempArray = $1.slice();
      tempArray.push($3);
      $$ = tempArray;
    }
  ;
  
params_stmt
  : IDF 
  | IDF ',' params_stmt 
  ;

switch_stmt
  : SWITCH expression '{' case_block '}'
  ;

parse_stmt
  : '(' var_type ')'
  ;

value_lit
  : F_LIT 
  | INT_LIT 
  | CHAR_LIT 
  | IDF 
  | 'QUOTE' IDF 'QUOTE'
  | value_lit'[' array_stmt ']'
  | '[' array_stmt ']'
  | parse_stmt value_lit
  | value_lit
  ;

return_statement
  : RETURN value_lit 
  ;

expression_statement
  : assignment_expression
  | function_call
  | expression 
  ;

var_type
  : 'VAR'
  | 'INT'
  | 'DOUBLE'
  | 'FLOAT'
  | 'CHAR'
  ;
  
assignment_expression
  : var_type id '=' expression                              { criarVariavel($1, $2, $4, escopoAtual); }
  | var_type id ';'                                         { criarVariavel($1, $2, "undefined", escopoAtual); }
  | var_type id '[' value_lit ']' ';'                       { criarVariavel($1, $2, "undefined", escopoAtual); }
  | var_type id '[' value_lit ']' '=' '{' array_stmt '}'    { criarVariavel($1, $2, ($7 + $8 + $9), escopoAtual); }
  | value_lit '=' value_lit
  | value_lit '=' expression
  | id '=' value_lit
  | expression '=' expression
  | value_lit '+''=' value_lit       { var tempVar = createTempVar(); addInstruction('+', $1, $4, tempVar); $$ = tempVar; }
  | value_lit '-''=' value_lit       { var tempVar = createTempVar(); addInstruction('-', $1, $4, tempVar); $$ = tempVar; }
  | value_lit '*''=' value_lit       { var tempVar = createTempVar(); addInstruction('*', $1, $4, tempVar); $$ = tempVar; }
  | value_lit '/''=' value_lit       { var tempVar = createTempVar(); addInstruction('/', $1, $4, tempVar); $$ = tempVar; }
  | value_lit '+' '+'                { var tempVar = createTempVar(); addInstruction('+', $1, 1, tempVar); $$ = tempVar; }
  | value_lit '-' '-'                { var tempVar = createTempVar(); addInstruction('-', $1, 1, tempVar); $$ = tempVar; }
  | value_lit
  ;

id
  : IDF { $$ = [$1]; }
  | id ',' IDF { $$ = $1; $$.push($3); }
  ;

function_call
  : DEFINE IDF '(' params_stmt ')' '{' statement '}' 
  | DEFINE IDF '(' params_stmt ')' ':' statement 
  | DEFINE assignment_expression 
  | IDF '(' params_stmt ')' statement 
  | IDF '(' params_stmt ')' ';' statement 
  ;

case_block
  : case_statements
  | 
  ;

case_statements
  : case_statement
  | case_statements case_statement
  ;

case_statement
  : CASE value_lit ':' statements
  | CASE value_lit ':'
  | DEFAULT ':' statements
  ;

do_stmt
  : DO statement WHILE '(' conditional_expression ')' ';'
  ;

repeat_statement  
  : WHILE '(' conditional_expression ')' statements
  | FOR '(' assignment_expression ';' conditional_expression ';' expression ')' for_stmt
  ;
  
for_stmt
  : '{''}'
  | '{' statement '}'
  | '{' statements '}'
  ;

return_statement
  : RETURN value_lit ';'
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
  : expression '%' expression  { var tempVar = createTempVar(); addInstruction('%', $1, $3, tempVar); $$ = tempVar; }
  | expression '+' expression  { var tempVar = createTempVar(); addInstruction('+', $1, $3, tempVar); $$ = tempVar; }
  | expression '-' expression  { var tempVar = createTempVar(); addInstruction('-', $1, $3, tempVar); $$ = tempVar; }
  | expression '*' expression  { var tempVar = createTempVar(); addInstruction('*', $1, $3, tempVar); $$ = tempVar; }
  | expression '/' expression  { var tempVar = createTempVar(); addInstruction('/', $1, $3, tempVar); $$ = tempVar; }
  | expression '^' expression  { var tempVar = createTempVar(); addInstruction('^', $1, $3, tempVar); $$ = tempVar; }
  | '%' expression             { var tempVar = createTempVar(); addInstruction('%', $$, $2, tempVar); $$ = tempVar; }
  | '+' expression             { var tempVar = createTempVar(); addInstruction('+', $$, $2, tempVar); $$ = tempVar; }
  | '-' expression             { var tempVar = createTempVar(); addInstruction('-', $$, $2, tempVar); $$ = tempVar; }
  | '*' expression             { var tempVar = createTempVar(); addInstruction('*', $$, $2, tempVar); $$ = tempVar; }
  | '/' expression             { var tempVar = createTempVar(); addInstruction('/', $$, $2, tempVar); $$ = tempVar; }
  | '^' expression             { var tempVar = createTempVar(); addInstruction('^', $$, $2, tempVar); $$ = tempVar; }
  | '-' expression             { var tempVar = createTempVar(); addInstruction('-', $$, $2, tempVar); $$ = tempVar; }
  | expression '+' '+'         { var tempVar = createTempVar(); addInstruction('+', $1, 1, tempVar); $$ = tempVar; }
  | expression '-' '-'         { var tempVar = createTempVar(); addInstruction('-', $1, 1, tempVar); $$ = tempVar; }
  | '(' expression ')'         
  | conditional_expression     
  | value_lit
  ;