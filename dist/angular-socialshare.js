/*
 * angular-socialshare
 * 2.1.12
 * 
 * A social media url and content share module for angularjs.
 * http://720kb.githb.io/angular-socialshare
 * 
 * MIT license
 * Tue Jun 14 2016
 */
/*global angular*/
/*eslint no-loop-func:0, func-names:0*/

(function withAngular(angular) {
  'use strict';

  var directiveName = 'socialshare'
    , socialshareProviderNames = ['facebook', 'twitter', 'reddit', /*'whatsapp', 'facebook-messenger'*/]
    , socialshareConfigurationProvider = /*@ngInject*/ function socialshareConfigurationProvider() {

      var socialshareConfigurationDefault = [
      {
        'provider': 'facebook',
        'conf': {
          'url':'',
          'text': '',
          'media': '',
          'type': '',
          'via': '',
          'to': '',
          'from': '',
          'ref': '',
          'display': '',
          'source': '',
          'caption': '',
          'redirectUri': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      {
        'provider': 'twitter',
        'conf': {
          'url': '',
          'text': '',
          'via': '',
          'hashtags': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      {
        'provider': 'reddit',
        'conf': {
          'url': '',
          'text': '',
          'subreddit': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      /*{
        'provider': 'facebook-messenger',
        'conf': {
          'url': ''
        }
      },
      {
        'provider': 'whatsapp',
        'conf': {
          'url': '',
          'text': ''
        }
      }*/
      ];

      return {
        'configure': function configure(configuration) {

          var configIndex = 0
            , configurationKeys
            , configurationIndex
            , aConfigurationKey
            , configElement
            , internIndex = 0
          //this is necessary becuase provider run before any service
          //so i have to take the log from another injector
          , $log = angular.injector(['ng']).get('$log');

          if (configuration && configuration.length > 0) {
            for (; configIndex < configuration.length; configIndex += 1) {
              if (configuration[configIndex].provider && socialshareProviderNames.indexOf(configuration[configIndex].provider) > -1) {

                for (; internIndex < socialshareConfigurationDefault.length; internIndex += 1) {
                  configElement = socialshareConfigurationDefault[internIndex];

                  if (configElement &&
                    configElement.provider &&
                    configuration[configIndex].provider === configElement.provider) {

                      configurationKeys = Object.keys(configElement.conf);
                      configurationIndex = 0;

                      for (; configurationIndex < configurationKeys.length; configurationIndex += 1) {

                        aConfigurationKey = configurationKeys[configurationIndex];
                        if (aConfigurationKey && configuration[configIndex].conf[aConfigurationKey]) {

                          configElement.conf[aConfigurationKey] = configuration[configIndex].conf[aConfigurationKey];
                        }
                      }

                      // once the provider has been found and configuration applied
                      // we should reset the internIndex for the next provider match to work correctly
                      // and break, to skip loops on unwanted next providers
                      internIndex = 0;
                      break;
                    }
                  }
                } else {
                  $log.warn('Invalid provider at element ' + configIndex + ' with name:' + configuration[configIndex].provider);
                }
              }
            }
        }
        , '$get': /*@ngInject*/ function instantiateProvider() {

            return socialshareConfigurationDefault;
        }
      };
    }
    , socialshareDirective = /*@ngInject*/ ['$window', '$location', 'socialshareConf', '$log', function socialshareDirective($window, $location, socialshareConf, $log) {

      var linkingFunction = function linkingFunction($scope, element, attrs) {

        // observe the values in each of the properties so that if they're updated elsewhere,
        // they are updated in this directive.
        var configurationElement
        , index = 0
        , onEventTriggered = function onEventTriggered() {
          /*eslint-disable no-use-before-define*/
          if (attrs.socialshareProvider in sharingFunctions) {
            sharingFunctions[attrs.socialshareProvider]($window, $location, attrs, element);
          } else {
            return true;
          }
        };
        /*eslint-enable no-use-before-define*/
        //looking into configuration if there is a config for the current provider
        for (; index < socialshareConf.length; index += 1) {
          if (socialshareConf[index].provider === attrs.socialshareProvider) {
            configurationElement = socialshareConf[index];
            break;
          }
        }

        if (socialshareProviderNames.indexOf(configurationElement.provider) === -1) {
          $log.warn('Invalid Provider Name : ' + attrs.socialshareProvider);
        }

        //if some attribute is not define provide a default one
        attrs.socialshareUrl = attrs.socialshareUrl || configurationElement.conf.url;
        attrs.socialshareText = attrs.socialshareText || configurationElement.conf.text;
        attrs.socialshareMedia = attrs.socialshareMedia || configurationElement.conf.media;
        attrs.socialshareType =  attrs.socialshareType || configurationElement.conf.type;
        attrs.socialshareVia = attrs.socialshareVia || configurationElement.conf.via;
        attrs.socialshareTo =  attrs.socialshareTo || configurationElement.conf.to;
        attrs.socialshareFrom =  attrs.socialshareFrom || configurationElement.conf.from;
        attrs.socialshareRef = attrs.socialshareRef || configurationElement.conf.ref;
        attrs.socialshareDislay = attrs.socialshareDislay || configurationElement.conf.display;
        attrs.socialshareSource = attrs.socialshareSource || configurationElement.conf.source;
        attrs.socialshareCaption = attrs.socialshareCaption || configurationElement.conf.caption;
        attrs.socialshareRedirectUri = attrs.socialshareRedirectUri || configurationElement.conf.redirectUri;
        attrs.socialshareTrigger =  attrs.socialshareTrigger || configurationElement.conf.trigger;
        attrs.socialsharePopupHeight = attrs.socialsharePopupHeight || configurationElement.conf.popupHeight;
        attrs.socialsharePopupWidth = attrs.socialsharePopupWidth || configurationElement.conf.popupWidth;
        attrs.socialshareSubreddit = attrs.socialshareSubreddit || configurationElement.conf.subreddit;
        attrs.socialshareDescription = attrs.socialshareDescription || configurationElement.conf.description;
        attrs.socialshareFollow = attrs.socialshareFollow || configurationElement.conf.follow;
        attrs.socialshareHashtags = attrs.socialshareHashtags || configurationElement.conf.hashtags;
        attrs.socialshareBody = attrs.socialshareBody || configurationElement.conf.body;
        attrs.socialshareSubject = attrs.socialshareSubject || configurationElement.conf.subject;
        attrs.socialshareCc = attrs.socialshareCc || configurationElement.conf.cc;
        attrs.socialshareBcc = attrs.socialsharBcc || configurationElement.conf.bcc;

        if (attrs.socialshareTrigger) {

          element.bind(attrs.socialshareTrigger, onEventTriggered);
        } else {

          onEventTriggered();
        }
      };

      return {
        'restrict': 'A',
        'link': linkingFunction
      };
    }]
    , manageFacebookShare = function manageFacebookShare($window, $location, attrs) {

      var urlString;

      if (attrs.socialshareType && attrs.socialshareType === 'feed') {
        // if user specifies that they want to use the Facebook feed dialog (https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.4)
        urlString = 'https://www.facebook.com/dialog/feed?';

        if (attrs.socialshareVia) {
          urlString += '&app_id=' + encodeURIComponent(attrs.socialshareVia);
        }

        if (attrs.socialshareRedirectUri) {
          urlString += '&redirect_uri=' + encodeURIComponent(attrs.socialshareRedirectUri);
        }
        if (attrs.socialshareUrl) {
          urlString += '&link=' + encodeURIComponent(attrs.socialshareUrl);
        }

        if (attrs.socialshareTo) {
          urlString += '&to=' + encodeURIComponent(attrs.socialshareTo);
        }

        if (attrs.socialshareDisplay) {
          urlString += '&display=' + encodeURIComponent(attrs.socialshareDisplay);
        }

        if (attrs.socialshareRef) {
          urlString += '&ref=' + encodeURIComponent(attrs.socialshareRef);
        }

        if (attrs.socialshareFrom) {
          urlString += '&from=' + encodeURIComponent(attrs.socialshareFrom);
        }

        if (attrs.socialshareDescription) {
          urlString += '&description=' + encodeURIComponent(attrs.socialshareDescription);
        }

        if (attrs.socialshareText) {
          urlString += '&name=' + encodeURIComponent(attrs.socialshareText);
        }

        if (attrs.socialshareCaption) {
          urlString += '&caption=' + encodeURIComponent(attrs.socialshareCaption);
        }

        if (attrs.socialshareMedia) {
          urlString += '&picture=' + encodeURIComponent(attrs.socialshareMedia);
        }

        if (attrs.socialshareSource) {
          urlString += '&source=' + encodeURIComponent(attrs.socialshareSource);
        }

        $window.open(
          urlString,
          'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);

      } else if (attrs.socialshareType && attrs.socialshareType === 'send') {
        // if user specifies that they want to use the Facebook send dialog (https://developers.facebook.com/docs/sharing/reference/send-dialog)
        urlString = 'https://www.facebook.com/dialog/send?';

        if (attrs.socialshareVia) {
          urlString += '&app_id=' + encodeURIComponent(attrs.socialshareVia);
        }

        if (attrs.socialshareRedirectUri) {
          urlString += '&redirect_uri=' + encodeURIComponent(attrs.socialshareRedirectUri);
        }

        if (attrs.socialshareUrl) {
          urlString += '&link=' + encodeURIComponent(attrs.socialshareUrl);
        }

        if (attrs.socialshareTo) {
          urlString += '&to=' + encodeURIComponent(attrs.socialshareTo);
        }

        if (attrs.socialshareDisplay) {
          urlString += '&display=' + encodeURIComponent(attrs.socialshareDisplay);
        }

        if (attrs.socialshareRef) {
          urlString += '&ref=' + encodeURIComponent(attrs.socialshareRef);
        }

        $window.open(
          urlString,
          'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);

      } else {
        //otherwise default to using sharer.php
        $window.open(
          'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(attrs.socialshareUrl || $location.absUrl())
          , 'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
      }
    }
    , manageTwitterShare = function manageTwitterShare($window, $location, attrs) {
      var urlString = 'https://www.twitter.com/intent/tweet?';

      if (attrs.socialshareText) {
        urlString += 'text=' + encodeURIComponent(attrs.socialshareText);
      }

      if (attrs.socialshareVia) {
        urlString += '&via=' + encodeURIComponent(attrs.socialshareVia);
      }

      if (attrs.socialshareHashtags) {
        urlString += '&hashtags=' + encodeURIComponent(attrs.socialshareHashtags);
      }

      //default to the current page if a URL isn't specified
      urlString += '&url=' + encodeURIComponent(attrs.socialshareUrl || $location.absUrl());

      $window.open(
        urlString,
        'Twitter', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
    }
    , manageRedditShare = function manageRedditShare($window, $location, attrs) {
      var urlString = 'https://www.reddit.com/';

      if (attrs.socialshareSubreddit) {
        urlString += 'r/' + attrs.socialshareSubreddit + '/submit?url=';
      } else {
        urlString += 'submit?url=';
      }
      /*-
      * Reddit isn't responsive and at default width for our popups (500 x 500), everything is messed up.
      * So, overriding the width if it is less than 900 (played around to settle on this) and height if
      * it is less than 650px.
      */
      if (attrs.socialsharePopupWidth < 900) {
        attrs.socialsharePopupWidth = 900;
      }

      if (attrs.socialsharePopupHeight < 650) {
        attrs.socialsharePopupHeight = 650;
      }

      $window.open(
        urlString + encodeURIComponent(attrs.socialshareUrl || $location.absUrl()) + '&title=' + encodeURIComponent(attrs.socialshareText)
        , 'Reddit', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
      }

    /*, facebookMessengerShare = function facebookMessengerShare($window, $location, attrs, element) {

      var href = 'fb-messenger://share?link=' + encodeURIComponent(attrs.socialshareUrl || $location.absUrl());

      element.attr('href', href);
    }
    , manageWhatsappShare = function manageWhatsappShare($window, $location, attrs, element) {

      var href = 'whatsapp://send?text=' + encodeURIComponent(attrs.socialshareText + ' ') + encodeURIComponent(attrs.socialshareUrl || $location.absUrl());

      element.attr('href', href);
    }*/
    , sharingFunctions = {
      'email': manageEmailShare
      , 'facebook': manageFacebookShare
      , 'twitter': manageTwitterShare
      , 'reddit': manageRedditShare
      /*, 'facebook-messenger': facebookMessengerShare
      , 'whatsapp': manageWhatsappShare*/
    };


  angular.module('720kb.socialshare', [])
  .provider(directiveName + 'Conf', socialshareConfigurationProvider)
  .directive(directiveName, socialshareDirective);
}(angular));
