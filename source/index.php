<?php

require 'api/Slim/Slim.php';
// Paris and Idiorm
require 'api/Paris/idiorm.php';
require 'api/Paris/paris.php';

require 'api/models/User.php';
require 'api/config.php';
/* Congigurations are set fot ORM 
configuration are get from the @Config class.
*/
$con    = new Config();
$config = $con->getConfig();
ORM::configure('mysql:host=' . $config["host"] . ';dbname=' . $config["db"]);
ORM::configure('username', $config['username']);
ORM::configure('password', $config['pass']);

/*New App object is created and configure its templates*/
$app = new Slim();
$app->config(array(
    'templates.path' => '.'
));
/*App post and get methods.
In get method inde.html is render.
In post method data is saved to database and response is preapred. 
*/
$app->post('/addresult', 'addResult');
$app->get('/', function() use ($app)
{
    $app->render('index.html');
});
$app->run();




/*This method is called when client post the data to server
Then request object is got and json body is parsed.
*/
function addResult()
{
    
    $request = Slim::getInstance()->request();
    $result  = json_decode($request->getBody());
    /*If the user already exist then only score is updated if not then user is saved to data base*/
    if (userExist($result->email)) {
        
        updateScore($result->email, $result->score);
        
    } else {
        
        createUser($result);
        
    }
    
    /* get the users list for calculating the your position */
    $scores = Model::factory('User')->distinct()->select('score')->order_by_desc('score')->find_many();
    
    /* Prepare the response */
    $arr = array(
        "topScorer" => getTop(),
        /* Gte the top five user list*/
        "yourranking" => getYourRanking($scores, $result->score)
        /* Get your position*/
    );
    
    echo json_encode($arr);
}

/*It takes the @scores array and your score and calculate the position*/
function getYourRanking($scores, $yourscore)
{
    $counter = 0;
    foreach ($scores as $score) {
        if ($score->score == $yourscore) {
            return $counter + 1;
        } else {
            $counter = $counter + 1;
        }
    }
    
}

/* Check if the user exsit in the databse or not.
Return the flage according to result.
*/
function userExist($email)
{
    
    $user = Model::factory('User')->where('email', $email)->find_one();
    if ($user) {
        
        return true;
    } else {
        return false;
        
    }
    
}
/* Create the user in database*/
function createUser($result)
{
    
    $article        = Model::factory('User')->create();
    $article->name  = $result->name;
    $article->email = $result->email;
    $article->score = $result->score;
    $article->save();
    
}
/* it takes the @email and @score, find out the user with given email and updates it score */
function updateScore($email, $score)
{
    
    
    $user        = Model::factory('User')->where('email', $email)->find_one();
    $user->score = $score;
    $user->save();
}

function getTop()
{
    $stack      = array();
    $topScorers = Model::factory('User')->order_by_desc('score')->limit(5)->find_many();
    foreach ($topScorers as $topScorer) {
        array_push($stack, array(
            "name" => $topScorer->name,
            "score" => $topScorer->score
        ));
    }
    
    return $stack;
    
    
}






?>