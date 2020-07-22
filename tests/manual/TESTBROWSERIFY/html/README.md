# The Primo New UI Customization Workflow Development Environment


## html documentation

 - In this folder you will find static html files in their OTB state
 - The files are separated into directories (starting from the November 2016 Release)
 - You can edit the html to comply with your library requirements
 - To support multiple languages in your interface just add a suffix with the language code to your file-name,
   For example:

   1. homepage_fe_FR.html (in the August 2016 Release use home_fe_FR.html)
   2. help_de_DE.html(Available in the November 2016 Release)

   -    This is how your directory structure should look like:

 ![August 2016 Release structure image](../../help_files/htmlStructureAug.png "August 2016 Release structure")


 - Note that you can use Angular Material directives in your html:
 > https://material.angularjs.org/latest/


## Email templates
  Starting from 2020 Primo supports a new html template to customize email messages sent to patrons'.
  
  To customize this template create a file named email_fr_FR.html (based on your language suffix) and upload it using the html directory in your customization package.
  
  In this html file you can design your own email template using html.
  
  Since Primo supports the email action on multiple records you should add the following attribute to the html element represnting a record:
  
  ```ng-if="$ctrl.parentCtrl.fullViewLoaded" ng-repeat="item in $ctrl.parentCtrl.delayedItems"```
  
  for example:
  
  For an email template layout as below the attribute should be added to the records container:
  
  ```
  <header>
      <logo>
      <note>
  </header>
  <content>
      <general statement/>
      <records ng-if="$ctrl.parentCtrl.fullViewLoaded" ng-repeat="item in $ctrl.parentCtrl.delayedItems">
          <record1/>
          <record2/>
          ...
      </records>
      <footer>
      </footer>
  </content>  
  ```
  
  When editing the template you can:
  
  1. Use regular html (use best practices for email templating: https://mailchimp.com/help/about-html-email/) to design the layout of your email based on your preferences.
  
  2. You can take advantage of some of our OTB directives in your templates:
```
      <prm-brief-result
             class="result-item-details"
             [item]="item"
             display-mode="email"
             layout="column">
     </prm-brief-result>


    <prm-search-result-availability-line tabindex="-1" [result]="item" display-mode="email"></prm-search-result-availability-line>

    <prm-logo style="height: 66px;"></prm-logo>
    
 ```   
 3. You can reference the sent item(pnx/record) using angular syntax to present the relevant data:
 
  use the curly brackets to access the pnx diectly - for example: 
```
   {{item.pnx.display.title}}
```
  or loop over values using the ng-repeat directive to add multiple fields:
  
```<div dir="auto" ng-repeat="oclcid in     item.pnx.addata.oclcid">
    <div style="font-weight: 600;margin-top:2em;"> Additional Information From the Record:</div>
    <span ng-if="item.pnx.addata.oclcid" atyle="">OCLCID: </span>
    <div dir="auto" ng-repeat="oclcid in item.pnx.addata.oclcid">{{oclcid}}</div>
```
``` ```






**Notice :** Any link in your template will be removed - for security reasons, we will not allow links other than the link to the record to avoid email exploits.

To add the link to the full record you can either:
 1. Use the 
 
 ```
 <prm-brief-result
             class="result-item-details"
             [item]="item"
             display-mode="email"
             layout="column">
     </prm-brief-result>
 ```    
directive in your template - This includes the link to the record

2. Use the following code snippet in your template:

    ```
    <a
      data-emailref="{{item.pnx.control.recordid[0]}}" href="">
      {{item.pnx.display.title[0]}}
    </a>
    ```
     
To use your library logo (not the OTB <prm-logo></prm-logo>) you can use your own html, with an img element that has a class attribute of *logo-image* immediatly following the opening tag, for example:
 
 ```
 <table height="60px" width="600" cellpadding="0" cellspacing="0" border="0" align="center" class="wrapper" bgcolor="#17bef7">
    <tbody>
    <tr>
        <td align="center" bgcolor="#eeeeee">
            <img class="logo-image" translate-attr="{ alt: 'nui.header.LogoAlt' }"  ng-src="custom/emaildemo/img/library-logo.png" height="60" style="height:60px;max-height:60px;background-color:#17bef7;">
        </td>
    </tr>
    </tbody>
</table>
```
    
    
 ## Examples        
        
 Full examples of email templates can be found in the help files folder folder:
 
   1. [The Out of the Box template for emails](../../help_files/email_en_US.html) email_en_US.html
   
   2. [A template based on the OTB - brief + custom fields + availability](../../help_files/email_en_US-brief+additionalField+availability.html)
    will produce the following email:
   
   ![example brief](../../help_files/example-bried-and-subject.png "example brief")     
 
   3. [A template based on an open source email template with no Primo directives - just use of the ```{{item.pnx.display.title}}```](../../help_files/email_en_US_Details.html)
    will produce the following email:
    
   ![example external](../../help_files/example-external.png "example external")




