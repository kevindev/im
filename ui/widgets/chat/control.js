define(
    [
        'jquery',
        'utils'
    ],
    function($, utils) {

        var widget = function($el) {
            var control = this;

            control.element = $el;
            control.$body = control.element.find('.chat__body');
            control.$form = control.element.find('.chat__form');

            control.$form.on('submit', function() {
                var $form = $(this),
                    message = {};

                $form.find('.chat__input_invalid').removeClass('chat__input_invalid');

                utils.each($form.serializeArray(), function(data) {
                    message[data.name] = data.value;
                });

                control._validateMessage(message).done(function(result) {
                    switch (result.status) {
                        case 'valid':
                            $form.find('[name="text"]').val('');
                            control.sendMessage(message);
                            break;
                        case 'invalid':
                            control.showErrors(result.errors);
                            break;
                    }
                });

                return false;
            });

            $(top).on('message', function(e) {
                var data = e.originalEvent.data;

                switch (data.channel) {
                    case 'messages':
                        switch (data.action) {
                            case 'add':
                                control.renderMessage(data.message);
                                break;
                        }
                        break;
                }
            });

        };

        utils.extend(widget.prototype, {
            sendMessage: function(message) {
                var control = this;

                var messages = JSON.parse(top.sessionStorage.messages);

                messages.push(message);

                top.sessionStorage.messages = JSON.stringify(messages);

                top.postMessage({
                    channel: 'messages',
                    action: 'add',
                    message: message
                }, document.location.protocol + '//' + document.location.host);

            },
            renderMessage: function(message) {
                var control = this;
                control.$body.append(utils.template($('#messageTemplate').html(), message));
            },
            showErrors: function(errors) {

                var control = this;

                utils.each(errors, function(error, field) {
                    control.$form.find('[name="' + field + '"]').closest('.chat__input').addClass('chat__input_invalid');
                });
            },
            _validateMessage: function(data) {
                var deferred = new $.Deferred(),
                    result = {},
                    errors = {};

                if (!data.text) {
                    errors.text = 'required field'
                }

                if (!data.username) {
                    errors.username = 'required field'
                }

                if (utils.isEmpty(errors)) {
                    result = {
                        status: 'valid'
                    }
                } else {
                    result = {
                        status: 'invalid',
                        errors: errors
                    }
                }

                deferred.resolve(result);

                return deferred.promise();
            }
        });

        return widget;
    }
);