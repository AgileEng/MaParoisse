
package eu.agileeng.ws.client;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

import org.apache.tomcat.util.json.JSONArray;
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;


/**
 * <p>Java class for listServiceGroupsBean complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="listServiceGroupsBean">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="service" type="{http://service.frontal.dematbox.sagemcom.com/}serviceGroupDTO" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "listServiceGroupsBean", propOrder = {
    "service"
})
public class ListServiceGroupsBean {

    @XmlElement(nillable = true)
    protected List<ServiceGroupDTO> service;

    /**
     * Gets the value of the service property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the service property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getService().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ServiceGroupDTO }
     * 
     * 
     */
    public List<ServiceGroupDTO> getService() {
        if (service == null) {
            service = new ArrayList<ServiceGroupDTO>();
        }
        return this.service;
    }
    
    /**
     * Extract services tree form a <code>JSONArray</code>.
     * 
     * @param services
     * @throws JSONException 
     */
    public void createServiceList(JSONArray services) throws JSONException {
    	int len = services.length();
    	
    	for (int i = 0; i < len; i++) {
    		ServiceGroupDTO srv = new ServiceGroupDTO();
    		
    		srv.create(services.getJSONObject(i));
    		
    		this.getService().add(srv);
    	}
    }
    
    /**
     * 
     * Generate JSONArray
     * 
     * @return JSONArray
     * @throws JSONException
     */
    public JSONArray toJSONArray() throws JSONException {
    	JSONArray services = new JSONArray();
    	
    	for (ServiceGroupDTO srv: this.getService()) {
    		JSONObject jService = srv.toJSONObject();
    		
    		services.put(jService);
    	}
    	
    	return services;
    }

}
