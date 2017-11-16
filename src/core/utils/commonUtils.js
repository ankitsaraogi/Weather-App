export const get_yy_mm_dd_format_date_from_epoch = function(offset_in_hr)
{
  if (rdx.utils.is_not_defined(offset_in_hr))
  {offset_in_hr = 1;}

  var date = new Date().getTime();
  var start_date = date - (offset_in_hr * 3600 * 1000);
  var start_date_in_format = new Date(start_date).toJSON();
  start_date_in_format = start_date_in_format.replace("T", " ");
  start_date_in_format = start_date_in_format.substring(0, start_date_in_format.indexOf("."));
  return start_date_in_format;
};

export const get_yy_mm_dd_format_cur_date_form_epoch = function(epoch) {
  epoch *= 1000;
  var date = new Date(epoch).toJSON();
  date = date.replace("T", " ");
  date = date.substring(0, date.indexOf("."));
  return date;
};

export const dateToUTC = function(data)
{
  return new Date(data).toUTCString();
};

export const px2rem = px => `${px / 14}rem`;

export const isFunction = functionToCheck => (functionToCheck && getType.toString.call(functionToCheck) === '[object Function]')

export const isArray = function(object)
{
  return (object) && !(object.propertyIsEnumerable("length")) && typeof(object) === "object" && typeof(object.length) === "number";
};

export const isSameArray = function(first_arry,sec_arry,check_valid_range)
{
  var	index = 0;
  if (!first_arry || !sec_arry)
  {return false;}
  if ((first_arry.length != sec_arry.length) && (!(check_valid_range)))
  {return false;}
  if (check_valid_range)
  { if (check_valid_range <= Math.min(first_arry.length,sec_arry.length))
    {index = check_valid_range}
    else
      {return false;}
  }
  else
  {index = first_arry.length;};
  for (len=0; len < index; len++)
  {
    if (first_arry[len] != sec_arry[len])
    {return false;}
  }
  return true;
};

export const isObject = function(obj)
{
  if (((Object(obj) === obj) && Object.prototype.toString.call(obj)) == "[object Object]")
  {return true;};
  return false;
};

export const isObjectSame = function(resrc1, resrc2, keys_to_compare, do_strict )
{
  var strict_check = do_strict ? true: do_strict;
  if (!resrc1 || !resrc2)
  {return false;}

  for (var i = 0; i < keys_to_compare.length; i++)
  {
    if (resrc1[keys_to_compare[i]] != resrc2[keys_to_compare[i]])
    {
      if (isArray(resrc1[keys_to_compare[i]]) && isArray(resrc2[keys_to_compare[i]]))
      {
        if (isSameArray(resrc1[keys_to_compare[i]],resrc2[keys_to_compare[i]]))
        {continue;}
        else
        {return false;}
      }
      else if (isObject(resrc1[keys_to_compare[i]]) && isObject(resrc2[keys_to_compare[i]]))
      {
        if (isObjectSame(resrc1[keys_to_compare[i]],resrc2[keys_to_compare[i]]))
        {
          continue;
        }
      }
      else
      {return false;}
    }
  }
  return true;
};

export const getFormattedSizeInBytes = function(data) {
  var val = 0;
  if (rdx.utils.is_defined(data)) {
    val = parseInt(data);
    if (val < 1024) {
      val += "B";
    }
    else if (val >= 1024 && val < (1024 * 1024)) {
      val = parseFloat(val / 1024).toFixed(2) + "KB";
    }
    else if (val >= (1024 * 1024) && val < (1024 * 1024 * 1024)) {
      val = parseFloat(val / (1024 * 1024)).toFixed(2) + "MB";
    }
    else {
      val = parseFloat(val / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
  }

  return val;
};

export const replaceParamsInUrl = function(url, queryParams)
{
  if (! queryParams)  
  {return url;}

  for (var key in queryParams) {
    if (url.indexOf("{" + key + "}") != -1) {
      url = url.replace("{" + key + "}", queryParams[key]);
    }
  }

  return url;
};

export const getFormattedTime = function(time, type)
{
  let dateStr = "";
    
  if (type == "UTC") {
    let am_pm = "AM";
    let date = new Date(time);
    let seconds = date.getUTCSeconds();
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();

    if (hours >= 12)
    {
      hours -= 12;
      am_pm = "PM";
    }
    if (hours < 10)
    {
      hours = "0"+hours;
    }
    if (minutes < 10)
    {
      minutes = "0"+minutes;
    }
    if (seconds < 10)
    {
      seconds = "0"+seconds;
    }
    dateStr = hours+":"+minutes+":"+seconds+" "+am_pm;
  }

  dateStr = dateStr === "" ? time : dateStr;
  return dateStr;
};

export const makeObjectFlat = function(obj, result = {}, id = "") {
  if (! obj) 
    return obj;

  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    
    if (isArray(obj[key])) {
      makeObjectFlat(obj[key][0], result, key);
    }
    else if (isObject(obj[key])){
      makeObjectFlat(obj[key], result, key);
    }
    else {
      let k = id !== "" ? id + "." + key : key;
      result[k] = obj[key];
    }
  }

  return result;
};
