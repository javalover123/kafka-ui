package com.provectus.kafka.ui.helpers;

import com.codeborne.selenide.Condition;
import org.openqa.selenium.By;

import static com.codeborne.selenide.Selenide.*;
import static com.codeborne.selenide.Selenide.$;

public class Utils {
    public static void refreshUntil(By by){
        int i =0;
        do
        {
            refresh();
            i++;
            sleep(2000);
        } while(getElements(by).size()<1 && i!=20);
        $(by).shouldBe(Condition.visible);
    }
}
