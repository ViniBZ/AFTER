<?php

if(isset($_POST['filename']))
{
    $filename = getcwd().'/'.$_POST['filename'];
    $content = file_get_contents($filename);
    if($content === false)
    {
        echo 'FAILED TO READ FILE';
    }else{
        echo $content;
    }
}

?>