# gitbook-plugin-classdisplayer

Include detailed infos for PHP classes, methods, functions or constants to your GitBook. (for example when documenting a PHP Library)

> ![HTML Preview](https://www.dropbox.com/s/0ln9u4liepkt6po/phpclassdisplayer_example.png?dl=1)

### Example

Markdown from Preview:
```
{% PHPclassDisplayer "DateTime" %}
    Datetime class
{% endPHPclassDisplayer %}

{% PHPmethodDisplayer "setDate($year, $month, $day)" %}
    Set the date.
    {% param "$year", type="int" %}
    The year.
    {% param "$month", type="int" %}
    The month.
    {% param "$day", type="int" %}
    The day.
    {% return %}
    Either false on failure, or the datetime object for method chaining.
{% endPHPmethodDisplayer %}

{% PHPmethodDisplayer "setTime($hour, $minute[, $second])" %}
    Set the time.
    {% param "$hour", type="int" %}
    The hour.
    {% param "$minute", type="int" %}
    The minute.
    {% param "$second", type="int" %}
    The second.
    {% return %}
    Either false on failure, or the datetime object for method chaining.
{% endPHPmethodDisplayer %}

{% PHPconstDisplayer "ATOM" %}
    Y-m-dTH:i:sP
{% endPHPconstDisplayer %}
```
