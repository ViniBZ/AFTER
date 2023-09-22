<?php

if(isset($_POST['content']) && isset($_POST['filename']))
{
    $filename = getcwd().'/'.$_POST['filename'];
    $res = file_put_contents($filename, $_POST['content']);
    if($res === false)
    {
        echo 'FAILED TO WRITE FILE';
    }else{
        echo 'WROTE '.$res.' bytes to file '.$_POST['filename'];
    }
}

?>